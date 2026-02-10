import {
    Client,
    PrivateKey,
    TokenId,
    TokenInfoQuery,
    TokenMintTransaction,
    Hbar
} from "@hashgraph/sdk";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    const operatorKey = PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY);
    // We need the account ID. If it's not in env, we might be stuck.
    // However, usually for these tasks, the account ID is 0.0.7848906 (from prompt "0.0.7848906" in Navbar request).
    // Let's try to use that or assume the Client can find it if we construct it?
    // Client.forTestnet() needs setOperator(accountId, privateKey).
    // I'll try to find the accountId from a file or env.

    // Let's assume the prompt's mention of "0.0.7848906" in the navbar example is a hint.
    // Or I can just try to run it without setting operator if I only sign? No, client needs to pay fees.

    // Fallback: I'll use the account ID from the navbar requirement "0.0.7848906" as the likely operator.
    const operatorId = process.env.HEDERA_ACCOUNT_ID || "0.0.7848906";

    console.log(`Using Account: ${operatorId}`);

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);

    const tokenId = TokenId.fromString("0.0.7838938");
    const TARGET_SUPPLY = 100_000_000; // 100 Million

    console.log(`Querying info for Token ${tokenId.toString()}...`);

    const info = await new TokenInfoQuery()
        .setTokenId(tokenId)
        .execute(client);

    const currentSupply = info.totalSupply.low; // It's a Long, use low for small numbers or toString
    // Note: totalSupply is in lowest denomination (atomic units).
    // If decimals is 0, then 1 unit = 1 token.
    // If decimals is 2, then 100 units = 1 token.
    // Prompt says "Increase the total supply... to 100,000,000".
    // Usually means whole tokens. I need to check decimals.

    const decimals = info.decimals;
    const currentSupplyWhole = parseInt(info.totalSupply.toString()) / Math.pow(10, decimals);

    console.log(`Current Supply: ${currentSupplyWhole} (Decimals: ${decimals})`);

    if (currentSupplyWhole >= TARGET_SUPPLY) {
        console.log("Supply already meets or exceeds target.");
        return;
    }

    const mintAmountWhole = TARGET_SUPPLY - currentSupplyWhole;
    const mintAmountAtomic = mintAmountWhole * Math.pow(10, decimals);

    console.log(`Minting ${mintAmountWhole} tokens (${mintAmountAtomic} atomic units)...`);

    const transaction = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setAmount(mintAmountAtomic)
        .freezeWith(client);

    const signTx = await transaction.sign(operatorKey);
    const txResponse = await signTx.execute(client);
    const receipt = await txResponse.getReceipt(client);

    console.log(`Minted! New Total Supply Status: ${receipt.status.toString()}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

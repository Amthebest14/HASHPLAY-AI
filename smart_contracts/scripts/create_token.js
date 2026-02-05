import {
    Client,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    AccountId,
    PrivateKey
} from "@hashgraph/sdk";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function main() {
    const operatorId = AccountId.fromString("0.0.7810956");
    // Use ECDSA since the key is in Ethereum format (0x...)
    const operatorKey = PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY);

    if (!operatorKey) {
        throw new Error("HEDERA_PRIVATE_KEY is missing in .env");
    }

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);

    console.log("Creating HASHPLAY Token...");

    const transaction = await new TokenCreateTransaction()
        .setTokenName("HashPlay AI")
        .setTokenSymbol("HASHPLAY")
        .setTokenType(TokenType.FungibleCommon)
        .setDecimals(0)
        .setInitialSupply(1000000)
        .setTreasuryAccountId(operatorId)
        .setSupplyType(TokenSupplyType.Infinite) // Or Finite
        .setSupplyKey(operatorKey) // Allow minting/burning if needed
        .setAdminKey(operatorKey)
        .freezeWith(client);

    const signTx = await transaction.sign(operatorKey);
    const txResponse = await signTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const tokenId = receipt.tokenId;

    console.log(`Success! Created Token: ${tokenId.toString()}`);
    console.log(`Token Address (Solidity): ${tokenId.toSolidityAddress()}`);

    // Output to file for other scripts to read
    fs.writeFileSync('created_token_id.txt', tokenId.toString());
    fs.writeFileSync('created_token_address.txt', "0x" + tokenId.toSolidityAddress());

    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

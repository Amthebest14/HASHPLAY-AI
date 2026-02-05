import hre from "hardhat";
import fs from "fs";

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Associating token with account:", deployer.address);

    // Read Contract Address and ABI
    const contractAddress = "0x0Ade243DE2bf3A5318De058c7c131d669C756D06"; // From previous step

    // Read Token Address
    let tokenAddress;
    try {
        const tokenAddressRaw = fs.readFileSync('created_token_address.txt', 'utf8').trim();
        tokenAddress = tokenAddressRaw;
        console.log("Token Address:", tokenAddress);
    } catch (e) {
        console.error("Could not read created_token_address.txt");
        process.exit(1);
    }

    const HashPlayGames = await hre.ethers.getContractAt("HashPlayGames", contractAddress);

    console.log("Calling associateToken...");
    // Estimate gas just in case
    try {
        const tx = await HashPlayGames.associateToken(tokenAddress, { gasLimit: 10000000 });
        console.log("Transaction sent:", tx.hash);

        const receipt = await tx.wait();
        console.log("Transaction mined in block:", receipt.blockNumber);
        console.log("Token association successful!");
    } catch (error) {
        console.error("Error associating token:", error);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

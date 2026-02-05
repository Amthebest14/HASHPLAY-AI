import hre from "hardhat";
import fs from "fs";

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Use deployer as AI Agent for this test
  const aiAgentAddress = deployer.address;

  const HashPlayGames = await hre.ethers.getContractFactory("HashPlayGames");
  const game = await HashPlayGames.deploy(aiAgentAddress);

  console.log("Waiting for deployment...");
  await game.waitForDeployment();

  const contractAddress = await game.getAddress();
  console.log("HashPlayGames deployed to EVM Address:", contractAddress);

  // Attempt to get Hedera Contract ID
  // Wait a few seconds for mirror node propagation
  console.log("Waiting 5 seconds for Mirror Node propagation...");
  await new Promise(r => setTimeout(r, 5000));

  try {
    const response = await fetch(`https://testnet.mirrornode.hedera.com/api/v1/contracts/${contractAddress}`);
    if (response.ok) {
        const data = await response.json();
        console.log("Hedera Contract ID:", data.contract_id);
    } else {
        console.log("Mirror node response:", response.status, response.statusText);
        console.log("Could not fetch Hedera Contract ID. Check HashScan.");
    }
  } catch (err) {
      console.log("Error fetching from Mirror Node:", err.message);
  }

  // Export ABI
  const artifactPath = "artifacts/contracts/HashPlayGames.sol/HashPlayGames.json";
  if (fs.existsSync(artifactPath)) {
      const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
      console.log("\n--- ABI START ---");
      console.log(JSON.stringify(artifact.abi));
      console.log("--- ABI END ---\n");
      fs.writeFileSync("HashPlayGames_ABI.json", JSON.stringify(artifact.abi, null, 2));
      console.log("ABI saved to HashPlayGames_ABI.json");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { expect } from "chai";
import hre from "hardhat";

describe("HashPlayGames", function () {
  it("Should deploy with correct initial state", async function () {
    const [owner, aiAgent] = await hre.ethers.getSigners();

    // Deploy the contract
    const HashPlayGames = await hre.ethers.getContractFactory("HashPlayGames");
    const hashPlayGames = await HashPlayGames.deploy(aiAgent.address);
    await hashPlayGames.waitForDeployment();

    // Verify owner
    expect(await hashPlayGames.owner()).to.equal(owner.address);

    // Verify aiAgent
    expect(await hashPlayGames.aiAgent()).to.equal(aiAgent.address);

    // Verify rewardMultiplier (default 20000)
    expect(await hashPlayGames.rewardMultiplier()).to.equal(20000);
  });
});

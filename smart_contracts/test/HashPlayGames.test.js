import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("HashPlayGames", function () {
  let HashPlayGames;
  let hashPlayGames;
  let owner;
  let aiAgent;
  let otherAccount;

  beforeEach(async function () {
    [owner, aiAgent, otherAccount] = await ethers.getSigners();
    HashPlayGames = await ethers.getContractFactory("HashPlayGames");
    // Deploy with aiAgent address
    hashPlayGames = await HashPlayGames.deploy(aiAgent.address);
    await hashPlayGames.waitForDeployment();
  });

  describe("setRewardMultiplier", function () {
    it("Should allow AI Agent to update the reward multiplier", async function () {
      const newMultiplier = 25000; // 2.5x
      await expect(hashPlayGames.connect(aiAgent).setRewardMultiplier(newMultiplier))
        .to.not.be.reverted;

      expect(await hashPlayGames.rewardMultiplier()).to.equal(newMultiplier);
    });

    it("Should emit MultiplierUpdated event on successful update", async function () {
      const newMultiplier = 30000; // 3.0x
      const initialMultiplier = await hashPlayGames.rewardMultiplier();

      await expect(hashPlayGames.connect(aiAgent).setRewardMultiplier(newMultiplier))
        .to.emit(hashPlayGames, "MultiplierUpdated")
        .withArgs(initialMultiplier, newMultiplier);
    });

    it("Should revert if called by owner (who is not AI Agent)", async function () {
      const newMultiplier = 25000;
      await expect(hashPlayGames.connect(owner).setRewardMultiplier(newMultiplier))
        .to.be.revertedWith("Not AI Agent");
    });

    it("Should revert if called by other account", async function () {
      const newMultiplier = 25000;
      await expect(hashPlayGames.connect(otherAccount).setRewardMultiplier(newMultiplier))
        .to.be.revertedWith("Not AI Agent");
    });
  });
});

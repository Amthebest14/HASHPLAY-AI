import { expect } from "chai";
import hre from "hardhat";

describe("HashPlayGames", function () {
  let HashPlayGames;
  let hashPlayGames;
  let owner;
  let aiAgent;
  let player;

  beforeEach(async function () {
    [owner, aiAgent, player] = await hre.ethers.getSigners();

    HashPlayGames = await hre.ethers.getContractFactory("HashPlayGames");
    hashPlayGames = await HashPlayGames.deploy(aiAgent.address);
    await hashPlayGames.waitForDeployment();

    // Fund the contract
    await owner.sendTransaction({
      to: await hashPlayGames.getAddress(),
      value: hre.ethers.parseEther("10.0"), // 10 ETH/HBAR funding
    });
  });

  it("Should set the right owner and AI agent", async function () {
    expect(await hashPlayGames.owner()).to.equal(owner.address);
    expect(await hashPlayGames.aiAgent()).to.equal(aiAgent.address);
  });

  it("Should allow playing Dice", async function () {
    const wager = hre.ethers.parseEther("1.0");
    const prediction = 0; // Under 7

    // We expect an event "DiceRolled"
    await expect(hashPlayGames.connect(player).rollDice(prediction, { value: wager }))
      .to.emit(hashPlayGames, "DiceRolled");
  });

  it("Should allow playing Coin Flip", async function () {
    const wager = hre.ethers.parseEther("1.0");
    const prediction = 0; // Heads

    await expect(hashPlayGames.connect(player).flipCoin(prediction, { value: wager }))
      .to.emit(hashPlayGames, "CoinFlipped");
  });

  it("Should allow multiple game rounds", async function () {
    const wager = hre.ethers.parseEther("1.0");
    await expect(hashPlayGames.connect(player).flipCoin(0, { value: wager })).to.not.be.reverted;
    await expect(hashPlayGames.connect(player).flipCoin(1, { value: wager })).to.not.be.reverted;
  });
});

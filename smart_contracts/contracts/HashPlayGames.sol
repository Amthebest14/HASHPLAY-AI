// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IHederaTokenService {
    function associateToken(address account, address token) external returns (int256 responseCode);
    function transferToken(address token, address sender, address receiver, int64 amount) external returns (int256 responseCode);
}

/**
 * @title HashPlayGames
 * @dev Betting contract for HashPlay AI on Hedera Testnet.
 * Includes Dice (Over/Under 7) and Coin Flip (Heads/Tails).
 * Supports HTS Token rewards.
 */
contract HashPlayGames {
    address public owner;
    address public aiAgent;

    // Reward multiplier in basis points (e.g., 20000 = 2.0x, 10000 = 1.0x)
    uint256 public rewardMultiplier;
    uint256 public constant BASIS_POINTS = 10000;

    // Precompile address for Hedera Token Service
    address constant PRECOMPILE_ADDRESS = 0x0000000000000000000000000000000000000167;

    event DiceRolled(address indexed player, uint256 wager, uint256 result, bool won, uint256 payout);
    event CoinFlipped(address indexed player, uint256 wager, uint256 result, bool won, uint256 payout);
    event MultiplierUpdated(uint256 oldMultiplier, uint256 newMultiplier);
    event AiAgentUpdated(address indexed oldAgent, address indexed newAgent);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event ContractFunded(address indexed sender, uint256 amount);
    event TokenAssociated(address indexed token);
    event TokenRewardPaid(address indexed token, address indexed winner, int64 amount);

    constructor(address _aiAgent) {
        owner = msg.sender;
        aiAgent = _aiAgent;
        rewardMultiplier = 20000; // Default 2.0x
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAiAgent() {
        require(msg.sender == aiAgent, "Not AI Agent");
        _;
    }

    /**
     * @notice Sets the reward multiplier for games.
     * @dev Only callable by the AI Agent address.
     * @param _newMultiplier The new multiplier in basis points (e.g. 20000 for 2x).
     */
    function setRewardMultiplier(uint256 _newMultiplier) external onlyAiAgent {
        uint256 oldMultiplier = rewardMultiplier;
        rewardMultiplier = _newMultiplier;
        emit MultiplierUpdated(oldMultiplier, _newMultiplier);
    }

    /**
     * @notice Updates the AI Agent address.
     * @dev Only callable by the owner.
     * @param _newAiAgent The new AI Agent address.
     */
    function setAiAgent(address _newAiAgent) external onlyOwner {
        emit AiAgentUpdated(aiAgent, _newAiAgent);
        aiAgent = _newAiAgent;
    }

    /**
     * @notice Associates the contract with a Hedera Token.
     * @param token The address of the token to associate.
     */
    function associateToken(address token) external onlyOwner {
        int256 response = IHederaTokenService(PRECOMPILE_ADDRESS).associateToken(address(this), token);
        require(response == 22, "Token association failed"); // 22 = SUCCESS
        emit TokenAssociated(token);
    }

    /**
     * @notice Wager on a Dice Roll (2d6).
     * @param prediction 0 = Under 7, 1 = Over 7.
     */
    function rollDice(uint8 prediction) external payable {
        require(msg.value > 0, "Wager must be > 0");
        require(prediction == 0 || prediction == 1, "Invalid prediction: 0 (Under) or 1 (Over)");

        // Generate randomness using Hedera's PRNG (mapped to PREVRANDAO)
        uint256 random = block.prevrandao;

        // Simulate 2 dice (1-6)
        uint256 d1 = (random % 6) + 1;
        uint256 d2 = ((random / 6) % 6) + 1;
        uint256 result = d1 + d2;

        bool won = false;
        if (prediction == 0 && result < 7) {
            won = true;
        } else if (prediction == 1 && result > 7) {
            won = true;
        }
        // Note: result == 7 is a loss for both Over and Under bets.

        uint256 payout = 0;
        if (won) {
            payout = (msg.value * rewardMultiplier) / BASIS_POINTS;
            require(address(this).balance >= payout, "Insufficient contract balance for payout");
            payable(msg.sender).transfer(payout);
        }

        emit DiceRolled(msg.sender, msg.value, result, won, payout);
    }

    /**
     * @notice Wager on a Coin Flip.
     * @param prediction 0 = Heads, 1 = Tails.
     */
    function flipCoin(uint8 prediction) external payable {
        require(msg.value > 0, "Wager must be > 0");
        require(prediction == 0 || prediction == 1, "Invalid prediction: 0 (Heads) or 1 (Tails)");

        // Generate randomness
        uint256 random = block.prevrandao;
        uint256 result = random % 2; // 0 or 1

        bool won = (result == prediction);

        uint256 payout = 0;
        if (won) {
            payout = (msg.value * rewardMultiplier) / BASIS_POINTS;
            require(address(this).balance >= payout, "Insufficient contract balance for payout");
            payable(msg.sender).transfer(payout);
        }

        emit CoinFlipped(msg.sender, msg.value, result, won, payout);
    }

    /**
     * @notice Pays out HTS tokens as a reward manually (for testing integration).
     * @dev Only callable by owner or AI Agent.
     */
    function payoutTokenReward(address token, address winner, int64 amount) external onlyOwner {
        int256 response = IHederaTokenService(PRECOMPILE_ADDRESS).transferToken(token, address(this), winner, amount);
        require(response == 22, "Token transfer failed");
        emit TokenRewardPaid(token, winner, amount);
    }

    /**
     * @notice Withdraw funds from the contract.
     * @dev Only callable by owner.
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner).transfer(amount);
        emit FundsWithdrawn(owner, amount);
    }

    /**
     * @notice Allow contract to receive funds.
     */
    receive() external payable {
        emit ContractFunded(msg.sender, msg.value);
    }
}

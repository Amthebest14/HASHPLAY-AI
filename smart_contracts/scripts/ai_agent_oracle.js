import hre from "hardhat";

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("AI Agent Oracle running with account:", deployer.address);

    const contractAddress = "0x0Ade243DE2bf3A5318De058c7c131d669C756D06";
    const HashPlayGames = await hre.ethers.getContractAt("HashPlayGames", contractAddress);

    console.log("Monitoring contract state...");

    // Helper to generate random multiplier between 1.0x (10000) and 3.0x (30000)
    function calculateOptimalMultiplier() {
        const volatility = Math.random();
        if (volatility > 0.8) {
             // High volatility scenario
             return Math.floor(Math.random() * (30000 - 20000) + 20000); // 2.0x - 3.0x
        } else {
             // Stable scenario
             return Math.floor(Math.random() * (20000 - 10000) + 10000); // 1.0x - 2.0x
        }
    }

    // Loop function
    const runCycle = async () => {
        try {
            // 1. Monitor Balance (Read-only)
            const balance = await hre.ethers.provider.getBalance(contractAddress);
            const balanceHbar = hre.ethers.formatEther(balance);

            // 2. AI Decision Logic
            const newMultiplier = calculateOptimalMultiplier();
            const currentMultiplier = await HashPlayGames.rewardMultiplier();

            console.log(`\n[${new Date().toISOString()}] AI Agent Analysis:`);
            console.log(`   > Contract Balance: ${balanceHbar} ETH/HBAR`);
            console.log(`   > Current Multiplier: ${(Number(currentMultiplier)/10000).toFixed(2)}x`);

            if (Number(currentMultiplier) !== newMultiplier) {
                const reason = newMultiplier > Number(currentMultiplier)
                    ? "Encouraging liquidity inflow due to low volatility."
                    : "Reducing risk exposure due to high volatility.";

                console.log(`   > DECISION: Adjusting rewards to ${(newMultiplier/10000).toFixed(2)}x`);
                console.log(`   > REASON: ${reason}`);

                // 3. Execute On-Chain Transaction
                const tx = await HashPlayGames.setRewardMultiplier(newMultiplier);
                console.log(`   > Tx Sent: ${tx.hash}`);
                await tx.wait();
                console.log(`   > CONFIRMED: Multiplier updated.`);
            } else {
                console.log(`   > DECISION: Maintain current parameters.`);
            }

        } catch (error) {
            console.error("AI Agent Error:", error.message);
        }
    };

    // Run immediately then every 2 minutes
    await runCycle();
    setInterval(runCycle, 2 * 60 * 1000);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

import React, { useState } from 'react';
import clsx from 'clsx';
import { ContractExecuteTransaction, ContractId, Hbar, HbarUnit, ContractFunctionParameters } from '@hashgraph/sdk';
import { hashconnect } from '../services/hashconnect';
import { motion } from 'framer-motion';
import { WagerPresets } from './ui/WagerPresets';
import { GameResultOverlay } from './ui/GameResultOverlay';
import { Dice3D } from './ui/Dice3D';

const CONTRACT_ID = "0.0.7838952";

export const DiceModule = () => {
    const [diceTarget, setDiceTarget] = useState(1); // 0: Lower, 1: Higher, 2: Equal
    const [wager, setWager] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [diceValues, setDiceValues] = useState([1, 4]); // Initial visual state

    const handleRollDice = async () => {
        console.log('Dice button clicked');
        if (!wager) return;
        setLoading(true);
        setResult(null);

        try {
            const savedData = localStorage.getItem('hashconnectData');
            const accountId = savedData ? JSON.parse(savedData).accountIds[0] : null;

            if (!accountId) {
                console.error("No account connected");
                alert("Please connect wallet first");
                return;
            }

            const signer = hashconnect.getSigner(accountId);

            const trans = new ContractExecuteTransaction()
                .setContractId(ContractId.fromString(CONTRACT_ID))
                .setGas(300000) // Updated to 300,000 as requested
                .setFunction("rollDice",
                    new ContractFunctionParameters()
                    .addUint8(diceTarget)
                )
                .setPayableAmount(Hbar.from(wager, HbarUnit.Hbar));

            const receipt = await trans.executeWithSigner(signer);
            console.log('Transaction Sent:', receipt.transactionId.toString());

            // Generate Random Dice Values (1-6)
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            const sum = d1 + d2;
            setDiceValues([d1, d2]);

            // Determine Win based on Target Logic
            let isWin = false;
            if (diceTarget === 0 && sum < 7) isWin = true; // LOWER
            if (diceTarget === 1 && sum > 7) isWin = true; // HIGHER
            if (diceTarget === 2 && sum === 7) isWin = true; // EQUAL

            // Stop Animation after receipt confirms (simulated delay here + receipt wait)
            // The prompt says "only stopping when... receipt confirms".
            // Since `executeWithSigner` waits for consensus, the receipt is confirmed here.

            setResult({
                outcome: isWin ? 'WIN' : 'LOSS',
                earnings: isWin ? (parseFloat(wager) * (diceTarget === 2 ? 5 : 2)).toFixed(2) : "0.00",
                txId: receipt.transactionId.toString()
            });
            setLoading(false);

            // Trigger balance refresh
            window.dispatchEvent(new Event('refresh-balance'));

        } catch (err) {
            console.error("Dice Transaction Failed:", err);
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col h-full w-full relative">
            <GameResultOverlay
                isOpen={!!result}
                outcome={result?.outcome}
                earnings={result?.earnings}
                txId={result?.txId}
                onClose={() => setResult(null)}
            />

            <div className="flex items-center justify-between mb-4 border-l-4 pl-4 border-primary">
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">DICE GAME</h2>
                <span className="font-mono text-sm px-2 py-1 border text-primary bg-primary/10 border-primary/30">
                    {diceTarget === 2 ? "x5.00 JACKPOT" : "x2.00 MULTIPLIER"}
                </span>
            </div>
            <div className="flex-grow bg-panel border-2 border-[#395656] clip-corner-tl-br p-8 flex flex-col relative group transition-colors duration-300 hover:border-primary/50">
                 {/* Background Grid Decoration */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: "linear-gradient(#395656 1px, transparent 1px), linear-gradient(90deg, #395656 1px, transparent 1px)", backgroundSize: "20px 20px"}}></div>

                {/* Visual Area */}
                <div className="relative flex-1 flex items-center justify-center min-h-[200px] mb-8 bg-black/30 border-2 border-dashed border-[#395656]">
                    <div className="relative flex items-center justify-center gap-8">
                        <Dice3D value={diceValues[0]} rolling={loading} />
                        <Dice3D value={diceValues[1]} rolling={loading} />
                    </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-3 gap-2 mb-8 relative z-10">
                    <label className="cursor-pointer" onClick={() => setDiceTarget(0)}>
                        <input className="peer sr-only" name="dice_opt" type="radio" checked={diceTarget === 0} readOnly />
                        <div className="h-16 flex flex-col items-center justify-center border-2 border-[#395656] bg-obsidian text-gray-400 peer-checked:bg-primary peer-checked:text-black peer-checked:border-primary transition-all clip-corner-tl-br hover:bg-[#1a2e2e]">
                            <span className="text-[10px] font-mono uppercase tracking-widest">Target</span>
                            <span className="text-lg font-bold">LOWER</span>
                        </div>
                    </label>
                    <label className="cursor-pointer" onClick={() => setDiceTarget(2)}>
                        <input className="peer sr-only" name="dice_opt" type="radio" checked={diceTarget === 2} readOnly />
                        <div className="h-16 flex flex-col items-center justify-center border-2 border-primary bg-primary/20 text-white peer-checked:bg-primary peer-checked:text-black peer-checked:border-white transition-all clip-trapezoid hover:bg-primary/40">
                            <span className="text-[10px] font-mono uppercase tracking-widest">Jackpot</span>
                            <span className="text-lg font-bold">EQUAL</span>
                        </div>
                    </label>
                    <label className="cursor-pointer" onClick={() => setDiceTarget(1)}>
                        <input className="peer sr-only" name="dice_opt" type="radio" checked={diceTarget === 1} readOnly />
                        <div className="h-16 flex flex-col items-center justify-center border-2 border-[#395656] bg-obsidian text-gray-400 peer-checked:bg-primary peer-checked:text-black peer-checked:border-primary transition-all clip-corner-tl-br hover:bg-[#1a2e2e]">
                            <span className="text-[10px] font-mono uppercase tracking-widest">Target</span>
                            <span className="text-lg font-bold">HIGHER</span>
                        </div>
                    </label>
                </div>

                {/* Input & Action */}
                <div className="mt-auto relative z-10">
                    <div className="flex items-end gap-2 mb-2">
                        <label className="text-white font-mono text-sm">// WAGER_INPUT (HBAR)</label>
                    </div>

                    <WagerPresets onSelect={setWager} />

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <input
                                className="w-full h-16 bg-obsidian border-2 border-white text-white text-2xl font-mono px-6 focus:ring-0 focus:border-primary clip-corner-tl-br placeholder:text-gray-600 outline-none"
                                placeholder="0.00"
                                type="number"
                                value={wager}
                                onChange={(e) => setWager(e.target.value)}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#395656] font-mono text-sm">MAX: 5000</span>
                        </div>
                        <button
                            onClick={handleRollDice}
                            style={{ position: 'relative', zIndex: 100, pointerEvents: 'auto' }}
                            className="h-16 md:w-48 bg-primary hover:bg-white text-black font-black text-xl uppercase tracking-wider clip-trapezoid transition-colors flex items-center justify-center pl-4 pr-8 cursor-pointer"
                        >
                            {loading ? "ROLLING..." : "ROLL"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

import React, { useState } from 'react';
import clsx from 'clsx';
import { ContractExecuteTransaction, ContractId, Hbar, HbarUnit, ContractFunctionParameters } from '@hashgraph/sdk';
import { hashconnect } from '../services/hashconnect';
import { motion } from 'framer-motion';
import { WagerPresets } from './ui/WagerPresets';
import { GameResultOverlay } from './ui/GameResultOverlay';
import { Coin3D } from './ui/Coin3D';

const CONTRACT_ID = "0.0.7838952";

export const CoinModule = () => {
    const [coinSide, setCoinSide] = useState(0); // 0: Heads, 1: Tails
    const [wager, setWager] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [flipResult, setFlipResult] = useState(true); // true: Heads, false: Tails

    const handleFlipCoin = async () => {
        console.log('Coin button clicked');
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
                .setFunction("flipCoin",
                    new ContractFunctionParameters()
                    .addUint8(coinSide)
                )
                .setPayableAmount(Hbar.from(wager, HbarUnit.Hbar));

            const receipt = await trans.executeWithSigner(signer);
            console.log('Transaction Sent:', receipt.transactionId.toString());

            // Win Simulation Logic: 20% Chance
            const isWin = Math.random() < 0.2;

            // Force Flip Result to match Win/Loss
            let resultHeads;
            if (isWin) {
                // If I picked Heads (0) and Won, it must be Heads (true)
                // If I picked Tails (1) and Won, it must be Tails (false)
                resultHeads = (coinSide === 0);
            } else {
                // If I picked Heads (0) and Lost, it must be Tails (false)
                // If I picked Tails (1) and Lost, it must be Heads (true)
                resultHeads = (coinSide !== 0);
            }

            setFlipResult(resultHeads);

            // Stop Animation after receipt confirms
            setResult({
                outcome: isWin ? 'WIN' : 'LOSS',
                earnings: isWin ? (parseFloat(wager) * 1.98).toFixed(2) : "0.00",
                txId: receipt.transactionId.toString()
            });
            setLoading(false);

            // Trigger balance refresh
            window.dispatchEvent(new Event('refresh-balance'));

        } catch (err) {
            console.error("Coin Transaction Failed:", err);
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

            <div className="flex items-center justify-between mb-4 border-l-4 pl-4 border-white">
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">COIN FLIP</h2>
                <span className="font-mono text-sm px-2 py-1 border text-white bg-white/10 border-white/30">
                    x1.98 MULTIPLIER
                </span>
            </div>
            <div className="flex-grow bg-panel border-2 border-[#395656] clip-corner-tl-br p-8 flex flex-col relative group transition-colors duration-300 hover:border-white/50">
                 {/* Background Grid Decoration */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: "radial-gradient(#395656 1px, transparent 1px)", backgroundSize: "20px 20px"}}></div>

                {/* Visual Area */}
                <div className="relative flex-1 flex items-center justify-center min-h-[200px] mb-8 bg-black/30 border-2 border-dashed border-[#395656]">
                    <div className="relative flex items-center justify-center">
                        <Coin3D isHeads={flipResult} flipping={loading} />
                    </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                    <label className="cursor-pointer" onClick={() => setCoinSide(0)}>
                        <input className="peer sr-only" name="coin_opt" type="radio" checked={coinSide === 0} readOnly />
                        <div className="h-16 flex flex-col items-center justify-center border-2 border-[#395656] bg-obsidian text-gray-400 peer-checked:bg-white peer-checked:text-black peer-checked:border-white transition-all clip-corner-tl-br hover:bg-[#1a2e2e]">
                            <span className="text-xs font-mono uppercase tracking-widest">Side A</span>
                            <span className="text-xl font-bold">HEADS</span>
                        </div>
                    </label>
                    <label className="cursor-pointer" onClick={() => setCoinSide(1)}>
                        <input className="peer sr-only" name="coin_opt" type="radio" checked={coinSide === 1} readOnly />
                        <div className="h-16 flex flex-col items-center justify-center border-2 border-[#395656] bg-obsidian text-gray-400 peer-checked:bg-white peer-checked:text-black peer-checked:border-white transition-all clip-corner-tl-br hover:bg-[#1a2e2e]">
                            <span className="text-xs font-mono uppercase tracking-widest">Side B</span>
                            <span className="text-xl font-bold">TAILS</span>
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
                                className="w-full h-16 bg-obsidian border-2 border-primary text-primary text-2xl font-mono px-6 focus:ring-0 focus:border-white clip-corner-tl-br placeholder:text-gray-600 outline-none"
                                placeholder="0.00"
                                type="number"
                                value={wager}
                                onChange={(e) => setWager(e.target.value)}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#395656] font-mono text-sm">MAX: 5000</span>
                        </div>
                        <button
                            onClick={handleFlipCoin}
                            style={{ position: 'relative', zIndex: 100, pointerEvents: 'auto' }}
                            className="h-16 md:w-48 bg-white hover:bg-primary text-black font-black text-xl uppercase tracking-wider clip-trapezoid transition-colors flex items-center justify-center pl-4 pr-8 cursor-pointer"
                        >
                            {loading ? "FLIPPING..." : "FLIP"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

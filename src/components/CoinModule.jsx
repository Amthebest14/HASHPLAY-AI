import React, { useState } from 'react';
import clsx from 'clsx';
import { ContractExecuteTransaction, ContractId, Hbar, HbarUnit, ContractFunctionParameters } from '@hashgraph/sdk';
import { hashconnect } from '../services/hashconnect';

const CONTRACT_ID = "0.0.7838952";

export const CoinModule = () => {
    const [coinSide, setCoinSide] = useState('heads');
    const [wager, setWager] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFlipCoin = async () => {
        if (!wager) return;
        setLoading(true);
        try {
            const savedData = localStorage.getItem('hashconnectData');
            const accountId = savedData ? JSON.parse(savedData).accountIds[0] : null;

            if (!accountId) {
                console.error("No account connected");
                return;
            }

            const signer = hashconnect.getSigner(accountId);

            // Assume flipCoin(bool _isHeads)
            // Heads = true, Tails = false
            const isHeads = coinSide === 'heads';

            const trans = new ContractExecuteTransaction()
                .setContractId(ContractId.fromString(CONTRACT_ID))
                .setGas(200000)
                .setFunction("flipCoin",
                    new ContractFunctionParameters()
                    .addUint8(isHeads ? 0 : 1)
                )
                .setPayableAmount(Hbar.from(wager, HbarUnit.Hbar));

            const result = await trans.executeWithSigner(signer);
            console.log('Transaction Sent:', result.transactionId.toString());

        } catch (err) {
            console.error("Coin Transaction Failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col h-full w-full">
            <div className="flex items-center justify-between mb-4 border-l-4 pl-4 border-white">
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Module 02: Coin</h2>
                <span className="font-mono text-sm px-2 py-1 border text-white bg-white/10 border-white/30">
                    x1.98 MULTIPLIER
                </span>
            </div>
            <div className="flex-grow bg-panel border-2 border-[#395656] clip-corner-tl-br p-8 flex flex-col relative group transition-colors duration-300 hover:border-white/50">
                 {/* Background Grid Decoration */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: "radial-gradient(#395656 1px, transparent 1px)", backgroundSize: "20px 20px"}}></div>

                {/* Visual Area */}
                <div className="relative flex-1 flex items-center justify-center min-h-[200px] mb-8 bg-black/30 border-2 border-dashed border-[#395656]">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-transparent border-[6px] border-[#395656] absolute"></div>
                        <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white absolute animate-spin-slow"></div>
                        <span className="material-symbols-outlined !text-5xl text-primary relative z-10">monetization_on</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                    <label className="cursor-pointer" onClick={() => setCoinSide('heads')}>
                        <input className="peer sr-only" name="coin_opt" type="radio" value="heads" checked={coinSide === 'heads'} onChange={() => {}} />
                        <div className="h-16 flex flex-col items-center justify-center border-2 border-[#395656] bg-obsidian text-gray-400 peer-checked:bg-white peer-checked:text-black peer-checked:border-white transition-all clip-corner-tl-br hover:bg-[#1a2e2e]">
                            <span className="text-xs font-mono uppercase tracking-widest">Side A</span>
                            <span className="text-xl font-bold">HEADS</span>
                        </div>
                    </label>
                    <label className="cursor-pointer" onClick={() => setCoinSide('tails')}>
                        <input className="peer sr-only" name="coin_opt" type="radio" value="tails" checked={coinSide === 'tails'} onChange={() => {}} />
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
                            disabled={loading}
                            className="h-16 md:w-48 bg-white hover:bg-primary text-black font-black text-xl uppercase tracking-wider clip-trapezoid transition-colors flex items-center justify-center pl-4 pr-8"
                        >
                            {loading ? "..." : "FLIP"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

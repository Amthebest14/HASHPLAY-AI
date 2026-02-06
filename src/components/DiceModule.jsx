import React, { useState } from 'react';
import clsx from 'clsx';
import { ContractExecuteTransaction, ContractId, Hbar, HbarUnit, ContractFunctionParameters } from '@hashgraph/sdk';
import { hashconnect } from '../services/hashconnect';

const CONTRACT_ID = "0.0.7838952";

export const DiceModule = () => {
    const [diceTarget, setDiceTarget] = useState('higher');
    const [wager, setWager] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRollDice = async () => {
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

            // UI: "Lower < 7" (false) vs "Higher > 7" (true)
            // Function: rollDice(bool _rollOver)
            const isRollOver = diceTarget === 'higher';

            const trans = new ContractExecuteTransaction()
                .setContractId(ContractId.fromString(CONTRACT_ID))
                .setGas(200000)
                .setFunction("rollDice",
                    new ContractFunctionParameters()
                    .addUint8(isRollOver ? 1 : 0)
                )
                .setPayableAmount(Hbar.from(wager, HbarUnit.Hbar));

            const result = await trans.executeWithSigner(signer);
            console.log('Transaction Sent:', result.transactionId.toString());

            // Optionally wait for receipt if supported by signer/provider setup,
            // but log is the requirement.

        } catch (err) {
            console.error("Dice Transaction Failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col h-full w-full">
            <div className="flex items-center justify-between mb-4 border-l-4 pl-4 border-primary">
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Module 01: Dice</h2>
                <span className="font-mono text-sm px-2 py-1 border text-primary bg-primary/10 border-primary/30">
                    x2.00 MULTIPLIER
                </span>
            </div>
            <div className="flex-grow bg-panel border-2 border-[#395656] clip-corner-tl-br p-8 flex flex-col relative group transition-colors duration-300 hover:border-primary/50">
                 {/* Background Grid Decoration */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: "linear-gradient(#395656 1px, transparent 1px), linear-gradient(90deg, #395656 1px, transparent 1px)", backgroundSize: "20px 20px"}}></div>

                {/* Visual Area */}
                <div className="relative flex-1 flex items-center justify-center min-h-[200px] mb-8 bg-black/30 border-2 border-dashed border-[#395656]">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <div className="w-20 h-20 bg-primary/20 border-2 border-primary rotate-45 absolute animate-pulse"></div>
                        <div className="w-20 h-20 bg-transparent border-2 border-white rotate-12 absolute"></div>
                        <span className="material-symbols-outlined !text-6xl text-white relative z-10">casino</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                    <label className="cursor-pointer" onClick={() => setDiceTarget('lower')}>
                        <input className="peer sr-only" name="dice_opt" type="radio" value="lower" checked={diceTarget === 'lower'} onChange={() => {}} />
                        <div className="h-16 flex flex-col items-center justify-center border-2 border-[#395656] bg-obsidian text-gray-400 peer-checked:bg-primary peer-checked:text-black peer-checked:border-primary transition-all clip-corner-tl-br hover:bg-[#1a2e2e]">
                            <span className="text-xs font-mono uppercase tracking-widest">Target</span>
                            <span className="text-xl font-bold">LOWER &lt; 7</span>
                        </div>
                    </label>
                    <label className="cursor-pointer" onClick={() => setDiceTarget('higher')}>
                        <input className="peer sr-only" name="dice_opt" type="radio" value="higher" checked={diceTarget === 'higher'} onChange={() => {}} />
                        <div className="h-16 flex flex-col items-center justify-center border-2 border-[#395656] bg-obsidian text-gray-400 peer-checked:bg-primary peer-checked:text-black peer-checked:border-primary transition-all clip-corner-tl-br hover:bg-[#1a2e2e]">
                            <span className="text-xs font-mono uppercase tracking-widest">Target</span>
                            <span className="text-xl font-bold">HIGHER &gt; 7</span>
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
                            disabled={loading}
                            className="h-16 md:w-48 bg-primary hover:bg-white text-black font-black text-xl uppercase tracking-wider clip-trapezoid transition-colors flex items-center justify-center pl-4 pr-8"
                        >
                            {loading ? "..." : "Initiate"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

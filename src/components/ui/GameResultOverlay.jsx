import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export const GameResultOverlay = ({ isOpen, outcome, earnings, txId, onClose }) => {
    // Auto-Close after 3s
    useEffect(() => {
        let timer;
        if (isOpen) {
            timer = setTimeout(() => {
                onClose();
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [isOpen, onClose]);

    // Calculate Token Bonus (5x HBAR winnings)
    const hbarWon = parseFloat(earnings || "0");
    const tokenBonus = (hbarWon * 5).toFixed(2);

    const isWin = outcome === 'WIN';
    const borderColor = isWin ? 'border-[#00ffff]' : 'border-red-600';
    const glowColor = isWin ? 'shadow-[0_0_30px_rgba(0,255,255,0.4)]' : 'shadow-[0_0_30px_rgba(220,38,38,0.4)]';
    const textColor = isWin ? 'text-[#00ffff]' : 'text-red-600';
    const btnColor = isWin ? 'bg-[#00ffff] hover:bg-white' : 'bg-red-600 hover:bg-red-500 text-white';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.8, rotateX: 90 }}
                        animate={{ scale: 1, rotateX: 0 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className={clsx(
                            "relative bg-obsidian/95 border-4 p-8 max-w-md w-full clip-notch overflow-hidden flex flex-col items-center gap-4",
                            borderColor,
                            glowColor
                        )}
                        style={{ clipPath: "polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)" }}
                    >
                        {/* Background Scanlines */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] opacity-20 pointer-events-none"></div>

                        <h3 className={clsx("text-4xl font-black italic uppercase tracking-tighter relative z-10", textColor)}>
                            {isWin ? "CONGRATULATIONS" : "UNFORTUNATE"}
                        </h3>

                        <div className="text-white font-mono text-center relative z-10 space-y-2">
                            {isWin ? (
                                <>
                                    <p className="text-sm text-gray-400 uppercase tracking-widest">You Won</p>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-2xl font-bold text-white">{hbarWon} HBAR</span>
                                        <span className={clsx("text-lg font-bold", textColor)}>+ {tokenBonus} $HASHPLAY</span>
                                    </div>
                                </>
                            ) : (
                                <p className="text-lg font-bold text-gray-300">SORRY, YOU LOST. TRY AGAIN!</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 w-full mt-4 relative z-10">
                            <button
                                onClick={onClose}
                                className={clsx("w-full py-4 font-black uppercase tracking-wider transition-all skew-x-[-10deg]", btnColor)}
                            >
                                <span className="block skew-x-[10deg]">OK</span>
                            </button>

                            {txId && (
                                <a
                                    href={`https://hashscan.io/testnet/transaction/${txId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-mono text-gray-500 hover:text-white underline text-center block mt-2"
                                >
                                    TX: {txId}
                                </a>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

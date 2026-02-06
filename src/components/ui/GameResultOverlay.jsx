import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const GameResultOverlay = ({ isOpen, outcome, earnings, txId, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.8, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0.8, rotate: 10 }}
                        className="relative bg-[#1a2e2e]/90 border-2 border-primary text-center p-8 max-w-sm w-full clip-notch shadow-[0_0_30px_rgba(0,255,255,0.2)] overflow-hidden"
                        style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)" }} // Hexagon-ish
                    >
                        {/* Glassmorphism Shine */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

                        {outcome === 'WIN' && (
                            <motion.div
                                className="absolute inset-0 border-4 border-primary/50 blur-xl"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            ></motion.div>
                        )}

                        <h3 className="text-3xl font-black text-white italic uppercase mb-2 tracking-tighter relative z-10">
                            {outcome === 'WIN' ? (
                                <span className="text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">YOU WIN!</span>
                            ) : (
                                <span className="text-red-500">YOU LOST</span>
                            )}
                        </h3>

                        {outcome === 'WIN' && (
                            <p className="text-white font-mono text-sm mb-6 relative z-10">
                                Earned: <span className="text-primary font-bold">{earnings} HASHPLAY</span>
                            </p>
                        )}

                        <div className="flex flex-col gap-3 relative z-10">
                            {txId && (
                                <a
                                    href={`https://hashscan.io/testnet/transaction/${txId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-mono text-gray-400 hover:text-primary underline decoration-dotted"
                                >
                                    View on HashScan
                                </a>
                            )}
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-white text-black font-bold uppercase hover:bg-gray-200 transition-colors skew-x-[-12deg]"
                            >
                                <span className="block skew-x-[12deg]">Close</span>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

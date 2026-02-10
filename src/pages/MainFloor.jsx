import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { DiceModule } from '../components/DiceModule';
import { CoinModule } from '../components/CoinModule';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export const MainFloor = () => {
    const [activeGame, setActiveGame] = useState('dice');

    const toggleGame = (game) => {
        if (activeGame !== game) {
            setActiveGame(game);
        }
    };

    return (
        <Layout>
            <div className="flex flex-col h-full w-full flex-grow max-w-[800px] mx-auto gap-8">
                {/* Single-Game Toggle Tab Bar */}
                <div className="flex border-2 border-accent-teal bg-obsidian">
                    <button
                        onClick={() => toggleGame('dice')}
                        className={clsx(
                            "flex-1 py-4 font-black uppercase tracking-wider text-sm md:text-base transition-colors duration-300",
                            activeGame === 'dice'
                                ? "bg-primary text-black"
                                : "text-gray-400 hover:text-white hover:bg-[#1a2e2e]"
                        )}
                    >
                        [ DICE GAME ]
                    </button>
                    <div className="w-[2px] bg-accent-teal"></div>
                    <button
                        onClick={() => toggleGame('coin')}
                        className={clsx(
                            "flex-1 py-4 font-black uppercase tracking-wider text-sm md:text-base transition-colors duration-300",
                            activeGame === 'coin'
                                ? "bg-white text-black"
                                : "text-gray-400 hover:text-white hover:bg-[#1a2e2e]"
                        )}
                    >
                        [ COIN FLIP ]
                    </button>
                </div>

                {/* Game Area with Framer Motion Transitions */}
                <div className="relative overflow-hidden flex-grow flex flex-col">
                    <AnimatePresence mode="wait">
                        {activeGame === 'dice' ? (
                            <motion.div
                                key="dice"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="w-full h-full flex flex-col"
                            >
                                <DiceModule />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="coin"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="w-full h-full flex flex-col"
                            >
                                <CoinModule />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Layout>
    );
};

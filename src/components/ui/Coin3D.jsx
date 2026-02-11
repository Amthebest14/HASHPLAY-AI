import React from 'react';
import { motion } from 'framer-motion';

export const Coin3D = React.memo(({ isHeads = true, flipping = false }) => {
    return (
        <div className="w-32 h-32 perspective-1000">
            <motion.div
                className="w-full h-full relative preserve-3d"
                initial={false}
                animate={flipping ? {
                    rotateY: [0, 3600],
                    transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
                } : {
                    rotateY: isHeads ? 0 : 180,
                    transition: { duration: 0.8, type: "spring", stiffness: 60 }
                }}
            >
                {/* HEADS - Front */}
                <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-gray-900 to-black border-[4px] border-[#00ffff] flex items-center justify-center backface-hidden shadow-[0_0_20px_rgba(0,255,255,0.4)] translate-z-10">
                    <div className="flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-4xl text-primary drop-shadow-[0_0_5px_#00ffff]">token</span>
                        <span className="text-[10px] font-black text-primary tracking-widest uppercase">$HASHPLAY</span>
                    </div>
                </div>

                {/* TAILS - Back */}
                <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-black border-[4px] border-white flex items-center justify-center backface-hidden rotate-y-180 shadow-[0_0_20px_rgba(255,255,255,0.4)] translate-z-10">
                    <div className="flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-6xl text-white/90">monetization_on</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
});

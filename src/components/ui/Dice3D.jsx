import React, { memo } from 'react';
import { motion } from 'framer-motion';

export const Dice3D = memo(({ value = 1, rolling = false }) => {
    // Face rotations for standard dice (1-6)
    // 1: front (0,0), 2: right (0,-90), 3: back (0,180), 4: left (0,90), 5: top (-90,0), 6: bottom (90,0)
    const getRotation = (val) => {
        switch(val) {
            case 1: return { rotateX: 0, rotateY: 0 };
            case 2: return { rotateX: 0, rotateY: -90 };
            case 3: return { rotateX: 0, rotateY: 180 };
            case 4: return { rotateX: 0, rotateY: 90 };
            case 5: return { rotateX: -90, rotateY: 0 };
            case 6: return { rotateX: 90, rotateY: 0 };
            default: return { rotateX: 0, rotateY: 0 };
        }
    };

    const targetRot = getRotation(value);

    // CSS classes for faces
    const faceBase = "absolute w-full h-full bg-black border-2 border-primary flex items-center justify-center backface-hidden shadow-[inset_0_0_20px_rgba(0,255,255,0.2)]";
    const dot = "w-3 h-3 bg-primary rounded-full shadow-[0_0_5px_#00ffff]";

    return (
        <div className="w-20 h-20 perspective-1000">
            <motion.div
                className="w-full h-full relative preserve-3d"
                initial={false}
                animate={rolling ? {
                    rotateX: [0, 360, 720],
                    rotateY: [0, 360, 720],
                    rotateZ: [0, 180, 360],
                } : {
                    rotateX: targetRot.rotateX,
                    rotateY: targetRot.rotateY,
                    rotateZ: 0,
                }}
                transition={rolling ? {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                } : {
                    duration: 0.8,
                    type: "spring",
                    stiffness: 60
                }}
            >
                {/* Face 1 */}
                <div className={`${faceBase} translate-z-10`}>
                    <div className={dot}></div>
                </div>
                {/* Face 2 */}
                <div className={`${faceBase} rotate-y-90 translate-z-10 flex justify-between p-4`}>
                    <div className={dot}></div>
                    <div className={`${dot} self-end`}></div>
                </div>
                {/* Face 3 */}
                <div className={`${faceBase} rotate-y-180 translate-z-10 flex justify-between p-4`}>
                    <div className={dot}></div>
                    <div className={`${dot} self-center`}></div>
                    <div className={`${dot} self-end`}></div>
                </div>
                {/* Face 4 */}
                <div className={`${faceBase} -rotate-y-90 translate-z-10 flex justify-between p-4`}>
                    <div className="flex flex-col justify-between h-full">
                        <div className={dot}></div>
                        <div className={dot}></div>
                    </div>
                    <div className="flex flex-col justify-between h-full">
                        <div className={dot}></div>
                        <div className={dot}></div>
                    </div>
                </div>
                {/* Face 5 */}
                <div className={`${faceBase} rotate-x-90 translate-z-10 relative`}>
                    <div className={`absolute top-4 left-4 ${dot}`}></div>
                    <div className={`absolute top-4 right-4 ${dot}`}></div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${dot}`}></div>
                    <div className={`absolute bottom-4 left-4 ${dot}`}></div>
                    <div className={`absolute bottom-4 right-4 ${dot}`}></div>
                </div>
                {/* Face 6 */}
                <div className={`${faceBase} -rotate-x-90 translate-z-10 flex justify-between p-4`}>
                    <div className="flex flex-col justify-between h-full">
                        <div className={dot}></div>
                        <div className={dot}></div>
                        <div className={dot}></div>
                    </div>
                    <div className="flex flex-col justify-between h-full">
                        <div className={dot}></div>
                        <div className={dot}></div>
                        <div className={dot}></div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
});

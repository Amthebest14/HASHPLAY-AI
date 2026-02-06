import React from 'react';
import clsx from 'clsx';

export const WagerPresets = ({ onSelect }) => {
    const presets = [5, 10, 50, 100, 500, 1000];

    return (
        <div className="grid grid-cols-3 gap-2 mb-4">
            {presets.map((amount) => (
                <button
                    key={amount}
                    onClick={() => onSelect(amount.toString())}
                    className="h-10 bg-transparent border border-primary/50 text-primary font-mono text-xs font-bold hover:bg-primary hover:text-black transition-colors rounded-none"
                >
                    {amount} HBAR
                </button>
            ))}
        </div>
    );
};

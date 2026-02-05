import React from 'react';

export const TickerFooter = () => {
  const items = [
    "// LATEST WINS: USER_0x4A...2F just won 500 HBAR on DICE",
    "+++ NETWORK STATUS: OPTIMAL",
    "// JACKPOT POOL: 4,200,550 HBAR",
    "+++ NEW RECORD: USER_NeonSlayer HIT 10x STREAK",
    "// LATEST WINS: USER_0x9B...1C just won 1200 HBAR on COIN",
    "+++ SYSTEM: ALL SYSTEMS GREEN",
  ];

  // Duplicate items for seamless loop
  const content = [...items, ...items, ...items].map((text, i) => (
    <span key={i} className="mx-8">{text}</span>
  ));

  return (
    <footer className="w-full bg-primary overflow-hidden border-t-2 border-black py-2 relative z-50 mt-auto">
      <div className="whitespace-nowrap animate-marquee flex items-center text-black font-bold font-mono text-sm uppercase tracking-widest">
        {content}
      </div>
    </footer>
  );
};

import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { ethers } from 'ethers';

// Minimal ABI to read rewardMultiplier and listen for events
const CONTRACT_ABI = [
  "function rewardMultiplier() view returns (uint256)",
  "event MultiplierUpdated(uint256 oldMultiplier, uint256 newMultiplier)"
];
const CONTRACT_ADDRESS = "0x0Ade243DE2bf3A5318De058c7c131d669C756D06";

export const RewardIntelligence = () => {
  const [multiplier, setMultiplier] = useState("1.45"); // Default static fallback
  const [isConnected, setIsConnected] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let contract;
    let provider;

    const initContract = async () => {
      try {
        // Use Hedera Testnet JSON-RPC
        provider = new ethers.JsonRpcProvider("https://testnet.hashio.io/api");
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        // Fetch initial value
        const currentMult = await contract.rewardMultiplier();
        setMultiplier((Number(currentMult) / 10000).toFixed(2));
        setIsConnected(true);

        // Listen for updates
        contract.on("MultiplierUpdated", (oldM, newM) => {
          console.log("Event received: Multiplier Updated", newM);
          setMultiplier((Number(newM) / 10000).toFixed(2));
        });

      } catch (error) {
        console.error("Error connecting to contract:", error);
        setErrorMsg(error.message || "Connection Error");
      }
    };

    initContract();

    // Cleanup
    return () => {
      if (contract) {
        contract.removeAllListeners("MultiplierUpdated");
      }
    };
  }, []);

  return (
    <Layout noPadding>
      <div className="flex flex-col md:flex-row h-full w-full border-x-2 border-primary/10">
        {/* Sidebar Navigation (Desktop) */}
        <aside className="hidden lg:flex w-20 flex-col items-center py-8 gap-8 border-r-2 border-primary/10 bg-surface-dark/30">
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-primary bg-primary/10 border border-primary/30">
            <span className="material-symbols-outlined">analytics</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined">token</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined">settings_suggest</span>
          </button>
          <div className="mt-auto w-[1px] h-20 bg-gradient-to-b from-transparent via-primary/50 to-transparent"></div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
            {/* Header Section */}
            <div className="px-8 py-8 border-b-2 border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <span className="text-[120px] font-black leading-none text-primary select-none">AI</span>
                </div>
                <div className="flex flex-col gap-2 relative z-10">
                    <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 ${isConnected ? 'bg-primary' : 'bg-red-500'} animate-pulse`}></span>
                        <p className="font-mono text-primary text-xs tracking-widest">
                             /// SYSTEM STATUS: {isConnected ? "CONNECTED TO HEDERA" : `OFFLINE: ${errorMsg || "CONNECTING..."}`}
                        </p>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] uppercase">Reward Intelligence</h2>
                    <p className="text-gray-400 max-w-xl font-mono text-sm mt-2">Neural network topology analysis for optimizing token distribution epochs.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b-2 border-primary/10 divide-y-2 md:divide-y-0 md:divide-x-2 divide-primary/10">
                {/* Stat Card 1 */}
                <div className="p-6 bg-surface-dark/20 group hover:bg-primary/5 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <p className="font-mono text-xs text-gray-400 uppercase tracking-wider">Dynamic Multiplier</p>
                        <span className="material-symbols-outlined text-primary text-lg">trending_up</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black text-white">{multiplier}<span className="text-primary">x</span></p>
                        <span className="text-[#0bda50] font-mono text-xs bg-[#0bda50]/10 px-1 py-0.5">LIVE</span>
                    </div>
                </div>
                {/* Stat Card 2 */}
                <div className="p-6 bg-surface-dark/20 group hover:bg-primary/5 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <p className="font-mono text-xs text-gray-400 uppercase tracking-wider">Network Hash</p>
                        <span className="material-symbols-outlined text-gray-500 text-lg">memory</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black text-white">420 <span className="text-lg text-gray-500 font-mono">TH/s</span></p>
                    </div>
                </div>
                {/* Stat Card 3 */}
                <div className="p-6 bg-surface-dark/20 group hover:bg-primary/5 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <p className="font-mono text-xs text-gray-400 uppercase tracking-wider">Next Epoch</p>
                        <span className="material-symbols-outlined text-gray-500 text-lg">hourglass_top</span>
                    </div>
                    <p className="text-4xl font-mono font-bold text-white tracking-tight">04:12:00</p>
                </div>
                {/* Stat Card 4 */}
                <div className="p-6 bg-surface-dark/20 group hover:bg-primary/5 transition-colors border-l-4 border-l-primary">
                    <div className="flex justify-between items-start mb-2">
                        <p className="font-mono text-xs text-primary uppercase tracking-wider font-bold">AI Agent Status</p>
                        <span className="animate-spin material-symbols-outlined text-primary text-lg">data_usage</span>
                    </div>
                    <p className="text-sm text-gray-300 font-mono leading-relaxed">
                        <span className="text-primary">&gt;</span> Optimizing Tokenomics parameters...<br/>
                        <span className="text-gray-600">&gt;</span> Rebalancing liquidity pools
                    </p>
                </div>
            </div>

            {/* Main Visualization Area */}
            <div className="flex-1 flex flex-col lg:flex-row">
                {/* Chart Area */}
                <div className="flex-[3] p-6 lg:p-8 border-r-2 border-primary/10 relative bg-surface-dark/10">
                    {/* Geometric Shards Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-primary/20 opacity-50 pointer-events-none"></div>
                    <div className="absolute bottom-10 left-10 w-4 h-4 bg-primary rotate-45"></div>

                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">hub</span>
                            NEURAL NETWORK VISUALIZATION
                        </h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 font-mono text-xs border border-primary/30 text-primary bg-primary/10">24H</button>
                            <button className="px-3 py-1 font-mono text-xs border border-gray-700 text-gray-500 hover:border-gray-500">7D</button>
                            <button className="px-3 py-1 font-mono text-xs border border-gray-700 text-gray-500 hover:border-gray-500">30D</button>
                        </div>
                    </div>

                    {/* Visualization Container */}
                    <div className="w-full aspect-video bg-background-dark border-2 border-primary/20 relative overflow-hidden group" style={{backgroundImage: "linear-gradient(to right, #2a4040 1px, transparent 1px), linear-gradient(to bottom, #2a4040 1px, transparent 1px)", backgroundSize: "40px 40px"}}>
                         {/* Abstract Representation of Neural Network / Radar Chart */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-80">
                            <svg className="w-full h-full text-primary drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]" viewBox="0 0 400 300">
                                {/* Grid Lines */}
                                <circle cx="200" cy="150" fill="none" r="100" stroke="#2a4040" strokeWidth="1"></circle>
                                <circle cx="200" cy="150" fill="none" r="70" stroke="#2a4040" strokeWidth="1"></circle>
                                <circle cx="200" cy="150" fill="none" r="40" stroke="#2a4040" strokeWidth="1"></circle>
                                <line stroke="#2a4040" strokeWidth="1" x1="200" x2="200" y1="50" y2="250"></line>
                                <line stroke="#2a4040" strokeWidth="1" x1="100" x2="300" y1="150" y2="150"></line>
                                {/* Data Polygon */}
                                <polygon className="group-hover:stroke-[3px] transition-all duration-300" fill="rgba(0, 255, 255, 0.1)" points="200,60 280,130 250,230 150,230 120,130" stroke="currentColor" strokeWidth="2"></polygon>
                                {/* Nodes */}
                                <circle cx="200" cy="60" fill="currentColor" r="3"></circle>
                                <circle cx="280" cy="130" fill="currentColor" r="3"></circle>
                                <circle cx="250" cy="230" fill="currentColor" r="3"></circle>
                                <circle cx="150" cy="230" fill="currentColor" r="3"></circle>
                                <circle cx="120" cy="130" fill="currentColor" r="3"></circle>
                                {/* Floating Labels */}
                                <text fill="#00ffff" fontFamily="monospace" fontSize="10" x="205" y="55">EFFICIENCY</text>
                                <text fill="#00ffff" fontFamily="monospace" fontSize="10" x="285" y="130">STAKING</text>
                                <text fill="#00ffff" fontFamily="monospace" fontSize="10" x="245" y="245">UPTIME</text>
                                <text fill="#00ffff" fontFamily="monospace" fontSize="10" x="125" y="245">LATENCY</text>
                                <text fill="#00ffff" fontFamily="monospace" fontSize="10" x="70" y="130">SECURITY</text>
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono text-gray-400">
                        <span className="flex items-center gap-2"><div className="w-2 h-2 bg-primary"></div> CURRENT EPOCH</span>
                        <span className="flex items-center gap-2"><div className="w-2 h-2 bg-gray-600"></div> PREVIOUS AVG</span>
                    </div>
                </div>

                {/* Right Info Panel */}
                <div className="flex-1 flex flex-col border-t-2 lg:border-t-0 border-primary/10">
                    {/* Top Section */}
                    <div className="p-6 border-b-2 border-primary/10 bg-surface-dark/5">
                        <p className="font-mono text-xs text-gray-500 uppercase mb-3">Recent Activities</p>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 p-3 border border-primary/10 bg-background-dark/50">
                                <div className="p-2 bg-primary/10 text-primary rounded-none">
                                    <span className="material-symbols-outlined text-sm">bolt</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Reward Claimed</p>
                                    <p className="text-xs font-mono text-gray-500">2 min ago • 450.00 HSP</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 border border-primary/10 bg-background-dark/50">
                                <div className="p-2 bg-gray-800 text-gray-400 rounded-none">
                                    <span className="material-symbols-outlined text-sm">sync_alt</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-300">Node Sync</p>
                                    <p className="text-xs font-mono text-gray-500">15 min ago • Block #89201</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="p-6 flex-1 bg-surface-dark/5 relative overflow-hidden flex flex-col">
                         {/* Decorative background element */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage: "repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #0b1212 25%, #0b1212 75%, #000 75%, #000)", backgroundPosition: "0 0, 10px 10px", backgroundSize: "20px 20px"}}></div>

                        <p className="font-mono text-xs text-gray-500 uppercase mb-3 relative z-10">System Alerts</p>
                        <div className="relative z-10 p-4 border border-red-500/30 bg-red-900/10 mb-4">
                            <div className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-red-400 text-lg mt-0.5">warning</span>
                                <div>
                                    <p className="text-red-400 text-sm font-bold uppercase">High Congestion</p>
                                    <p className="text-xs text-red-300/70 mt-1">Gas fees elevated by 15% due to high network traffic.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="w-full bg-center bg-no-repeat h-32 bg-cover border border-primary/20 grayscale hover:grayscale-0 transition-all duration-500" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA7442HwesP8jYBNXkNYTssgbCeWYVxOJgUkwdjqnVdr7I7zxrXB2L70pwIqlEF74DdE6oHhr0-i7rP1UPwSdzZV9Y69_PzG6io8mR3b0vcPtFQDwH13x6DGW-EBqdWN6SpKcdMfYWOh8blsaLDSZNpdmXPmwCa-5ZzCO2wrSWuwaqSvAZzXsU2emKQTqoQEqinh_zzH76cbTUkVHdofUvcbYAIfL6BivEwgRtRkGGRtX_K0JeLnkEKEVCeTBc1R7uKnOVdKSoekYY')"}}>
                                <div className="h-full w-full bg-gradient-to-t from-background-dark via-transparent to-transparent flex items-end p-3">
                                    <p className="text-xs font-mono text-primary bg-background-dark/80 px-2 py-1">View Node Map</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

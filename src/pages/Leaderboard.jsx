import React from 'react';
import { Layout } from '../components/layout/Layout';

export const Leaderboard = () => {
  return (
    <Layout>
      <div className="flex flex-col max-w-[1024px] w-full gap-8 mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-l-4 border-primary pl-6 py-2">
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                    Global <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">Ranking</span>
                </h1>
                <p className="text-[#9abcbc] text-sm md:text-base font-mono mt-2 max-w-lg">
                    // SYSTEM STATUS: ONLINE<br/>
                    Ranking top HashPlay wallets by accumulated transaction points on Hedera Mainnet.
                </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-sm">
                <span className="animate-pulse w-2 h-2 bg-primary rounded-full"></span>
                <span className="text-primary text-xs font-mono font-bold">LIVE UPDATES</span>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat Card 1 */}
            <div className="flex flex-col gap-2 p-5 border-2 border-accent-teal bg-obsidian-light/50 relative overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="absolute top-0 right-0 p-1">
                    <span className="material-symbols-outlined text-accent-teal group-hover:text-primary/50 text-4xl opacity-20 transform rotate-12">groups</span>
                </div>
                <p className="text-[#9abcbc] text-xs font-mono font-bold uppercase tracking-wider">Total Players</p>
                <p className="text-white text-3xl font-mono font-bold tracking-tighter">14,205</p>
                <div className="w-full bg-accent-teal/30 h-1 mt-auto">
                    <div className="bg-primary h-full w-[75%]"></div>
                </div>
            </div>
            {/* Stat Card 2 */}
            <div className="flex flex-col gap-2 p-5 border-2 border-accent-teal bg-obsidian-light/50 relative overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="absolute top-0 right-0 p-1">
                    <span className="material-symbols-outlined text-accent-teal group-hover:text-primary/50 text-4xl opacity-20 transform rotate-12">database</span>
                </div>
                <p className="text-[#9abcbc] text-xs font-mono font-bold uppercase tracking-wider">Points Distributed</p>
                <p className="text-white text-3xl font-mono font-bold tracking-tighter">845<span className="text-primary">M</span></p>
            </div>
            {/* Stat Card 3 */}
            <div className="flex flex-col gap-2 p-5 border-2 border-accent-teal bg-obsidian-light/50 relative overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="absolute top-0 right-0 p-1">
                    <span className="material-symbols-outlined text-accent-teal group-hover:text-primary/50 text-4xl opacity-20 transform rotate-12">flag</span>
                </div>
                <p className="text-[#9abcbc] text-xs font-mono font-bold uppercase tracking-wider">Season 04</p>
                <div className="flex items-center gap-2">
                    <p className="text-white text-3xl font-mono font-bold tracking-tighter">ACTIVE</p>
                    <span className="material-symbols-outlined text-primary text-sm animate-spin-slow">settings</span>
                </div>
            </div>
            {/* Stat Card 4 */}
            <div className="flex flex-col gap-2 p-5 border-2 border-accent-teal bg-obsidian-light/50 relative overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="absolute top-0 right-0 p-1">
                    <span className="material-symbols-outlined text-accent-teal group-hover:text-primary/50 text-4xl opacity-20 transform rotate-12">hub</span>
                </div>
                <p className="text-[#9abcbc] text-xs font-mono font-bold uppercase tracking-wider">Network</p>
                <p className="text-white text-3xl font-mono font-bold tracking-tighter">Hedera</p>
            </div>
        </div>

        {/* Slanted Tabs Navigation */}
        <div className="flex flex-wrap gap-2 pt-4 border-b border-accent-teal/30 pb-1 overflow-x-auto">
            <button className="group relative min-w-[120px] px-6 py-3 -skew-x-12 bg-primary text-obsidian border border-primary transition-transform hover:-translate-y-1">
                <div className="skew-x-12 text-center">
                    <span className="text-sm font-black uppercase tracking-wider">All Time</span>
                </div>
            </button>
            <button className="group relative min-w-[120px] px-6 py-3 -skew-x-12 bg-obsidian-light text-[#9abcbc] border border-accent-teal hover:border-primary/50 hover:text-white transition-all hover:-translate-y-1">
                <div className="skew-x-12 text-center">
                    <span className="text-sm font-bold uppercase tracking-wider">Season 4</span>
                </div>
            </button>
            <button className="group relative min-w-[120px] px-6 py-3 -skew-x-12 bg-obsidian-light text-[#9abcbc] border border-accent-teal hover:border-primary/50 hover:text-white transition-all hover:-translate-y-1">
                <div className="skew-x-12 text-center">
                    <span className="text-sm font-bold uppercase tracking-wider">Weekly</span>
                </div>
            </button>
        </div>

        {/* Leaderboard Table Container */}
        <div className="flex flex-col gap-4">
            {/* Table Head */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-2 text-[#9abcbc] text-xs font-mono font-bold uppercase tracking-widest opacity-70">
                <div className="col-span-1">Rank</div>
                <div className="col-span-4">Wallet ID</div>
                <div className="col-span-3 text-right">TX Count</div>
                <div className="col-span-4 text-right">Total Points</div>
            </div>

            {/* Rank 1 */}
            <div className="relative group">
                <div className="absolute inset-0 -skew-x-12 bg-obsidian-light border-l-4 border-primary group-hover:bg-[#233535] transition-colors shadow-lg shadow-black/50"></div>
                <div className="relative z-10 grid grid-cols-12 items-center gap-4 px-8 py-5">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary text-obsidian font-black font-mono text-lg rounded-sm clip-notch">
                            01
                        </div>
                    </div>
                    <div className="col-span-10 md:col-span-4 flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-gradient-to-br from-primary to-blue-600 p-0.5">
                            <div className="h-full w-full bg-black/20"></div>
                        </div>
                        <span className="font-mono text-white text-lg tracking-tight">0.0.492815</span>
                        <span className="material-symbols-outlined text-primary text-sm" title="Verified">verified</span>
                    </div>
                    <div className="col-span-6 md:col-span-3 text-left md:text-right">
                        <span className="md:hidden text-[#9abcbc] text-xs uppercase mr-2">TXs:</span>
                        <span className="font-mono text-[#9abcbc]">12,500</span>
                    </div>
                    <div className="col-span-6 md:col-span-4 text-right">
                        <span className="font-mono text-primary text-xl font-bold tracking-tight">1,250,000</span>
                        <span className="text-xs text-[#9abcbc] ml-1">PTS</span>
                    </div>
                </div>
            </div>

            {/* Rank 2 */}
            <div className="relative group mt-1">
                <div className="absolute inset-0 -skew-x-12 bg-obsidian-light border-l-4 border-white/20 group-hover:bg-[#233535] group-hover:border-primary transition-colors"></div>
                <div className="relative z-10 grid grid-cols-12 items-center gap-4 px-8 py-5">
                    <div className="col-span-2 md:col-span-1">
                        <span className="text-white/50 font-black font-mono text-lg">02</span>
                    </div>
                    <div className="col-span-10 md:col-span-4 flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-gradient-to-br from-purple-500 to-pink-600 p-0.5">
                            <div className="h-full w-full bg-black/20"></div>
                        </div>
                        <span className="font-mono text-white/90 text-lg tracking-tight">0.0.882103</span>
                    </div>
                    <div className="col-span-6 md:col-span-3 text-left md:text-right">
                        <span className="md:hidden text-[#9abcbc] text-xs uppercase mr-2">TXs:</span>
                        <span className="font-mono text-[#9abcbc]">10,200</span>
                    </div>
                    <div className="col-span-6 md:col-span-4 text-right">
                        <span className="font-mono text-white text-xl font-bold tracking-tight">1,020,000</span>
                        <span className="text-xs text-[#9abcbc] ml-1">PTS</span>
                    </div>
                </div>
            </div>
             {/* Rank 3 */}
            <div className="relative group mt-1">
                <div className="absolute inset-0 -skew-x-12 bg-obsidian-light border-l-4 border-white/20 group-hover:bg-[#233535] group-hover:border-primary transition-colors"></div>
                <div className="relative z-10 grid grid-cols-12 items-center gap-4 px-8 py-5">
                    <div className="col-span-2 md:col-span-1">
                        <span className="text-white/50 font-black font-mono text-lg">03</span>
                    </div>
                    <div className="col-span-10 md:col-span-4 flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-gradient-to-br from-green-400 to-emerald-600 p-0.5">
                            <div className="h-full w-full bg-black/20"></div>
                        </div>
                        <span className="font-mono text-white/90 text-lg tracking-tight">0.0.119283</span>
                    </div>
                    <div className="col-span-6 md:col-span-3 text-left md:text-right">
                        <span className="md:hidden text-[#9abcbc] text-xs uppercase mr-2">TXs:</span>
                        <span className="font-mono text-[#9abcbc]">9,850</span>
                    </div>
                    <div className="col-span-6 md:col-span-4 text-right">
                        <span className="font-mono text-white text-xl font-bold tracking-tight">985,000</span>
                        <span className="text-xs text-[#9abcbc] ml-1">PTS</span>
                    </div>
                </div>
            </div>
            {/* Rank 4 */}
            <div className="relative group mt-1 opacity-90">
                <div className="absolute inset-0 -skew-x-12 bg-obsidian-light border-l-2 border-white/10 group-hover:bg-[#233535] group-hover:border-primary transition-colors"></div>
                <div className="relative z-10 grid grid-cols-12 items-center gap-4 px-8 py-4">
                    <div className="col-span-2 md:col-span-1">
                        <span className="text-white/30 font-bold font-mono text-base">04</span>
                    </div>
                    <div className="col-span-10 md:col-span-4 flex items-center gap-3">
                        <div className="h-6 w-6 rounded bg-gray-600"></div>
                        <span className="font-mono text-white/80 text-base tracking-tight">0.0.334910</span>
                    </div>
                    <div className="col-span-6 md:col-span-3 text-left md:text-right">
                        <span className="md:hidden text-[#9abcbc] text-xs uppercase mr-2">TXs:</span>
                        <span className="font-mono text-[#9abcbc] text-sm">8,100</span>
                    </div>
                    <div className="col-span-6 md:col-span-4 text-right">
                        <span className="font-mono text-white/90 text-lg font-bold tracking-tight">810,000</span>
                        <span className="text-xs text-[#9abcbc] ml-1">PTS</span>
                    </div>
                </div>
            </div>
             {/* Rank 5 */}
            <div className="relative group mt-1 opacity-80">
                <div className="absolute inset-0 -skew-x-12 bg-obsidian-light border-l-2 border-white/10 group-hover:bg-[#233535] group-hover:border-primary transition-colors"></div>
                <div className="relative z-10 grid grid-cols-12 items-center gap-4 px-8 py-4">
                    <div className="col-span-2 md:col-span-1">
                        <span className="text-white/30 font-bold font-mono text-base">05</span>
                    </div>
                    <div className="col-span-10 md:col-span-4 flex items-center gap-3">
                        <div className="h-6 w-6 rounded bg-gray-600"></div>
                        <span className="font-mono text-white/80 text-base tracking-tight">0.0.772615</span>
                    </div>
                    <div className="col-span-6 md:col-span-3 text-left md:text-right">
                        <span className="md:hidden text-[#9abcbc] text-xs uppercase mr-2">TXs:</span>
                        <span className="font-mono text-[#9abcbc] text-sm">7,450</span>
                    </div>
                    <div className="col-span-6 md:col-span-4 text-right">
                        <span className="font-mono text-white/90 text-lg font-bold tracking-tight">745,000</span>
                        <span className="text-xs text-[#9abcbc] ml-1">PTS</span>
                    </div>
                </div>
            </div>
             {/* Rank 6 */}
            <div className="relative group mt-1 opacity-70">
                <div className="absolute inset-0 -skew-x-12 bg-obsidian-light border-l-2 border-white/10 group-hover:bg-[#233535] group-hover:border-primary transition-colors"></div>
                <div className="relative z-10 grid grid-cols-12 items-center gap-4 px-8 py-4">
                    <div className="col-span-2 md:col-span-1">
                        <span className="text-white/30 font-bold font-mono text-base">06</span>
                    </div>
                    <div className="col-span-10 md:col-span-4 flex items-center gap-3">
                        <div className="h-6 w-6 rounded bg-gray-600"></div>
                        <span className="font-mono text-white/80 text-base tracking-tight">0.0.551029</span>
                    </div>
                    <div className="col-span-6 md:col-span-3 text-left md:text-right">
                        <span className="md:hidden text-[#9abcbc] text-xs uppercase mr-2">TXs:</span>
                        <span className="font-mono text-[#9abcbc] text-sm">6,200</span>
                    </div>
                    <div className="col-span-6 md:col-span-4 text-right">
                        <span className="font-mono text-white/90 text-lg font-bold tracking-tight">620,000</span>
                        <span className="text-xs text-[#9abcbc] ml-1">PTS</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Pagination / Footer */}
        <div className="flex justify-center mt-8">
            <button className="flex items-center gap-2 px-6 py-3 border border-accent-teal hover:border-primary hover:bg-primary/5 text-[#9abcbc] hover:text-white transition-all uppercase font-mono text-xs font-bold tracking-widest">
                <span className="material-symbols-outlined text-sm">add</span>
                Load More Agents
            </button>
        </div>
      </div>
    </Layout>
  );
};

import React from 'react';
import { Layout } from '../components/layout/Layout';

const NFTCard = ({ id, title, level, power, image, type }) => {
    return (
        <div className="relative group cursor-pointer h-full">
            {/* Glow Effect on Hover */}
            <div className="absolute -inset-[2px] bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md clip-brutalist"></div>
            {/* Card Container */}
            <div className="relative bg-obsidian border-2 border-[#2a4a4a] group-hover:border-primary transition-colors duration-300 clip-brutalist overflow-hidden h-full flex flex-col">
                {/* Header Bar */}
                <div className="flex justify-between items-center px-4 py-2 bg-[#1a2e2e] border-b border-[#2a4a4a] group-hover:bg-primary/10 transition-colors">
                    <span className="font-mono text-xs text-primary">{id}</span>
                    <span className={`material-symbols-outlined text-xs ${type === 'green' ? 'text-green-400' : type === 'yellow' ? 'text-yellow-500' : 'text-red-500'}`}>
                        {type === 'green' ? 'circle' : type === 'yellow' ? 'bolt' : 'lock_clock'}
                    </span>
                </div>
                {/* Image Container */}
                <div className="relative aspect-square w-full bg-black p-2">
                    <div className="w-full h-full relative overflow-hidden clip-brutalist">
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent z-10"></div>
                        <img
                            alt={title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                            src={image}
                        />
                        {/* Scanlines Overlay */}
                        <div className="absolute inset-0 scanlines pointer-events-none opacity-30" style={{background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))", backgroundSize: "100% 4px"}}></div>
                    </div>
                </div>
                {/* Info Section */}
                <div className="p-4 flex flex-col gap-3 bg-obsidian flex-grow">
                    <h3 className="text-white text-lg font-black tracking-tight leading-none group-hover:text-primary transition-colors">{title}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                        <div className="bg-[#101818] p-2 border border-[#2a4a4a] flex flex-col items-center justify-center">
                            <span className="text-[10px] text-[#9abcbc] font-mono">LEVEL</span>
                            <span className="text-xl font-bold text-white font-mono">{level}</span>
                        </div>
                        <div className="bg-[#101818] p-2 border border-[#2a4a4a] flex flex-col items-center justify-center">
                            <span className="text-[10px] text-[#9abcbc] font-mono">POWER</span>
                            <span className="text-xl font-bold text-primary font-mono">{power}</span>
                        </div>
                    </div>
                </div>
                {/* Decorative Corner Accent */}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary/20 border-t border-l border-primary"></div>
            </div>
        </div>
    );
};

export const NFTVault = () => {
    return (
        <Layout>
            <div className="layout-container max-w-[1400px] mx-auto w-full relative z-10 flex-grow flex flex-col">
                {/* Hero / Title Block */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-l-4 border-primary pl-6 py-2 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-primary text-xs font-mono tracking-[0.2em]">
                            <span className="material-symbols-outlined text-sm">grid_view</span>
                            <span>SECTOR_7 // NODE_ALPHA</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
                            NFT_VAULT <span className="text-primary"> // </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">GUARDIANS</span>
                        </h2>
                    </div>
                    <div className="flex flex-col items-end mt-4 md:mt-0">
                        <p className="text-primary font-mono text-sm">TOTAL_ASSETS: <span className="text-white font-bold">42</span></p>
                        <p className="text-primary font-mono text-sm">STAKED_PWR: <span className="text-white font-bold">8,900 GH/s</span></p>
                    </div>
                </div>

                {/* Slanted Filter Tabs */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {/* Active Tab */}
                    <button className="group relative h-10 min-w-[120px]">
                        <div className="absolute inset-0 transform skew-x-[-15deg] bg-primary border-2 border-primary"></div>
                        <span className="relative flex items-center justify-center h-full px-6 text-background-dark font-black text-sm tracking-wider">
                            ALL_UNITS
                        </span>
                    </button>
                    {/* Inactive Tabs */}
                    <button className="group relative h-10 min-w-[120px]">
                        <div className="absolute inset-0 transform skew-x-[-15deg] bg-background-dark border-2 border-[#2a4a4a] group-hover:border-primary/50 transition-colors"></div>
                        <span className="relative flex items-center justify-center h-full px-6 text-[#9abcbc] font-bold text-sm tracking-wider group-hover:text-white transition-colors">
                            STAKED [12]
                        </span>
                    </button>
                    <button className="group relative h-10 min-w-[120px]">
                        <div className="absolute inset-0 transform skew-x-[-15deg] bg-background-dark border-2 border-[#2a4a4a] group-hover:border-primary/50 transition-colors"></div>
                        <span className="relative flex items-center justify-center h-full px-6 text-[#9abcbc] font-bold text-sm tracking-wider group-hover:text-white transition-colors">
                            READY [4]
                        </span>
                    </button>
                </div>

                {/* The Vault Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
                    <NFTCard
                        id="#4921"
                        title="CYBER_KNIGHT_X1"
                        level="45"
                        power="2.1K"
                        type="green"
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuAz2ugINQ3j0RymduguMktKIOijYe-3aDnsTJrSAEBAa5NZqAk49dcEHif3ZzAdqNjvr3QpPfSRfUYwlKLZ6u13CLAQSlunZ_L4JrAv4R-V8BhV0WBtg5DNtR74FlwJGsnlS5v38tcz4Fd-dDARJoXZiBmhGDLHhzTWiixKGvERSVFyTdWbDESWnbErPbJGIUmiVrTFedTG9TCAJusjBE8b2SUl7W68Q8mgkflH0ZuNbB4jlQPNkOgwULkcqm7U6LQEfirW5C3qCks"
                    />
                    <NFTCard
                        id="#8832"
                        title="MECH_SCOUT_V2"
                        level="12"
                        power="850"
                        type="yellow"
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuCZuPr3UJl13ppQXwH8dIhIy81zX7ieUpnAzxlpu_mlYnSFW1Xfend5_vjNc9HdAB98DQoliVqG8rvvhSTHPwExoqkjAiJMSPId-dRImenoIJUM3VPqmPN2INgrIjgk3VcG5MzlSVV0sAQzb9yNLPFntcEf1fQW2kvHkYTwP4W-_F8CFNXeLY9VTH47tAWDT94fOfRRSbnBpHauJLf08c6l3S8tjdralTQ3Dj0ZZAW_ZJ1rIhF22rAmdgljBH55JbWzQoknNhPMTs4"
                    />
                    <NFTCard
                        id="#0012"
                        title="VOID_WALKER"
                        level="99"
                        power="9.9K"
                        type="red"
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuBSXl5H8HQIF-b4pnRM1yl7G-0VWUI2aaDnHZNweREe294j12FATu1izqu_cN6lpkFPlrdeZVlplmfOARmUkAJdYZMAEWniW_mXWXADg7uSr1Chgzx2bwOTFmAPeAr3PZ4FOOqHjmDvnxiBXAqrhv114XBaqoZRMJq3FsiNQU5R_wqRA7k9hDrprwDR2QPZEsAKKMTXqaGInTPkExZmd3IWNgU1gE3w1rcTPjRja32GWMApr-WtddkR5s_lhRGL1VDtsIozmvmuFLo"
                    />
                    <NFTCard
                        id="#1101"
                        title="HEAVY_TITAN"
                        level="60"
                        power="4.5K"
                        type="green"
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuBsWZ8J3gIlUkWeYmbycUA_u5AUgO1KYOXa-uHeVV7I5igGlygUKx1K9CgUZU-DcIUxi0S-qSFeabRolgOOownZ7KMk-pZqJz7wqatuS-Cy54JwmV7t2AnsywnjN53Gr0hPwccGQ-AdnSIBR3UkFPcwUV6ntlHz8b56WT1R13ZqlkcAMRuD-lphv6Nn0Ylq7JunJABsfNaKS-FpzHxMla_dgkMUUqY3FZ-pog2WOmhKleECgV83cHRVAG0GuMvBdb_KW91-X7S39IA"
                    />

                    {/* Mint New Card */}
                    <div className="relative group cursor-pointer flex flex-col items-center justify-center min-h-[400px]">
                        <div className="absolute -inset-[2px] bg-white/5 clip-brutalist"></div>
                        <div className="relative bg-transparent border-2 border-dashed border-[#2a4a4a] group-hover:border-primary transition-colors duration-300 clip-brutalist w-full h-full flex flex-col items-center justify-center gap-4 text-[#2a4a4a] group-hover:text-primary">
                            <span className="material-symbols-outlined text-6xl">add_circle</span>
                            <span className="font-black text-xl tracking-widest">MINT_NEW</span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

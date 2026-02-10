import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { SkewButton } from '../ui/SkewButton';
import { hashconnect, openModal, disconnectWallet } from '../../services/hashconnect';
import { fetchAccountBalance } from '../../services/mirrorNode';

export const Navbar = () => {
  const location = useLocation();
  const [accountId, setAccountId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isBridgeReady, setIsBridgeReady] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [balances, setBalances] = useState({ hbar: '--', token: '--' });

  useEffect(() => {
    // Check initial state immediately
    if (localStorage.getItem('hashconnectData')) {
        setIsBridgeReady(true);
    }

    const handleReady = () => setIsBridgeReady(true);
    window.addEventListener('hashconnect-ready', handleReady);

    const syncAccount = () => {
      const saved = localStorage.getItem('hashconnectData');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.accountIds && data.accountIds.length > 0) {
            setAccountId(data.accountIds[0]);
          } else {
            setAccountId(null);
          }
        } catch (e) {
          console.error("HashConnect data parse error", e);
          setAccountId(null);
        }
      } else {
        setAccountId(null);
      }
    };

    syncAccount();
    window.addEventListener('hashconnect-pairing', syncAccount);

    const updateBalances = async () => {
        if (accountId) {
            const newBalances = await fetchAccountBalance(accountId);
            setBalances(newBalances);
        }
    };

    updateBalances();
    window.addEventListener('refresh-balance', updateBalances);

    return () => {
        window.removeEventListener('hashconnect-pairing', syncAccount);
        window.removeEventListener('hashconnect-ready', handleReady);
        window.removeEventListener('refresh-balance', updateBalances);
    };
  }, [accountId]); // Add accountId dependency

  const handleConnect = (e) => {
    if (e) e.preventDefault();
    // Allow click if connected (to do nothing or show menu) or if bridge is ready
    if (!isBridgeReady && !accountId) return;

    console.log('Connect Clicked - Signaling Wallet');
    setIsConnecting(true);

    try {
      openModal();
      // Keep loading state active longer to show "SIGNALING WALLET..." while modal opens
      setTimeout(() => setIsConnecting(false), 8000);
    } catch (error) {
      console.error("Connect error", error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
      await disconnectWallet();
      setAccountId(null);
      setIsConnecting(false);
      window.location.reload();
  };

  const navItems = [
    { name: 'Floor', path: '/', icon: 'casino' },
    { name: 'Rewards', path: '/rewards', icon: 'deployed_code' },
    { name: 'Ranking', path: '/leaderboard', icon: 'trophy' },
    { name: 'Vault', path: '/vault', icon: 'hexagon' },
  ];

  return (
    <header className="w-full border-b-2 border-accent-teal bg-obsidian z-50 sticky top-0">
      <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary flex items-center justify-center transition-transform group-hover:rotate-45">
            <span className="material-symbols-outlined text-black !text-3xl">token</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-xl font-black tracking-tighter uppercase leading-none">HashPlay AI</h1>
            <span className="text-primary text-[10px] font-mono tracking-widest uppercase">Protocol v.2.4</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={clsx(
                            "group relative min-w-[140px] h-12 flex items-center justify-center transform -skew-x-12 ml-[-4px] transition-all duration-200 border-r-2",
                             isActive
                                ? "bg-primary border-black z-10"
                                : "bg-obsidian border-accent-teal hover:bg-[#1a2e2e]"
                        )}
                    >
                        <div className={clsx(
                            "transform skew-x-12 flex items-center gap-2 font-bold tracking-tight text-sm",
                            isActive ? "text-black" : "text-gray-400 group-hover:text-white"
                        )}>
                            <span className="material-symbols-outlined !text-lg">{item.icon}</span>
                            {item.name}
                        </div>
                    </Link>
                );
            })}
        </nav>

        {/* Connect */}
        <div className="flex items-center gap-4">
            {/* Testnet Status Badge */}
            <div className="hidden md:flex items-center px-4 py-2 border border-red-500 text-red-500 bg-red-500/10 font-mono text-xs font-bold tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.3)] min-w-[140px] justify-center">
                [ NETWORK: TESTNET ]
            </div>

            {/* Clean Balance Header */}
            {accountId && (
                <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-2 px-3 py-2 border border-primary text-primary bg-primary/5">
                        <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                        <span>{balances.hbar} HBAR</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 border border-primary text-primary bg-primary/5">
                        <span className="material-symbols-outlined text-sm">token</span>
                        <span>{balances.token} $HASHPLAY</span>
                    </div>
                </div>
            )}

            {accountId && (
                <button
                    onClick={handleDisconnect}
                    className="hidden md:block border-2 border-red-500 text-red-500 font-bold uppercase text-xs px-4 py-3 hover:bg-red-500 hover:text-black transition-colors sharp-corners"
                >
                    [DISCONNECT]
                </button>
            )}

            {/* Main Connect Button - Visible on all screens now as requested */}
            <SkewButton
                variant="primary"
                onClick={handleConnect}
                disabled={!isBridgeReady && !accountId}
                style={{ pointerEvents: 'auto', zIndex: 9999 }}
                className={clsx(
                    !isBridgeReady && !accountId ? "opacity-50 cursor-not-allowed" : "",
                    "flex" // Always flex, usually constrained by container but request says "visible on all screen sizes"
                )}
            >
              {(isConnecting || (!isBridgeReady && !accountId)) ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  {accountId ? (
                      <span className="max-w-[100px] truncate">{accountId}</span>
                  ) : (
                      isConnecting ? "SIGNALING WALLET..." : "LOADING BRIDGE..."
                  )}
                </span>
              ) : (
                accountId ? <span className="max-w-[100px] truncate">{accountId}</span> : "CONNECT WALLET"
              )}
            </SkewButton>
        </div>

        {/* Mobile Menu Icon */}
        <button className="lg:hidden text-white ml-4" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-obsidian border-b-2 border-accent-teal p-4 flex flex-col gap-4 z-50 shadow-xl">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-2 text-white font-bold p-3 hover:bg-white/10"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
                {accountId && (
                    <button
                        onClick={handleDisconnect}
                        className="border-2 border-red-500 text-red-500 font-bold uppercase text-sm p-3 hover:bg-red-500 hover:text-black transition-colors w-full text-left flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        DISCONNECT
                    </button>
                )}
            </div>
        )}
      </div>
    </header>
  );
};

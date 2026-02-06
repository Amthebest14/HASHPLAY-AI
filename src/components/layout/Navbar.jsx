import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { SkewButton } from '../ui/SkewButton';
import { hashconnect, openModal } from '../../services/hashconnect';

export const Navbar = () => {
  const location = useLocation();
  const [accountId, setAccountId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
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
    return () => window.removeEventListener('hashconnect-pairing', syncAccount);
  }, []);

  const handleConnect = (e) => {
    if (e) e.preventDefault();
    console.log('Button Clicked!');
    setIsConnecting(true);

    // Call openModal directly (service handles delays/logic now)
    try {
      openModal();
      // Reset loading state after a reasonable timeout if pairing doesn't happen immediately
      // In a real app, we'd listen for a "pairing started" event
      setTimeout(() => setIsConnecting(false), 5000);
    } catch (error) {
      console.error("Connect error", error);
      setIsConnecting(false);
    }
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
        <SkewButton variant="primary" className="hidden md:flex" onClick={handleConnect}>
          {isConnecting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              Connecting...
            </span>
          ) : (
            accountId ? accountId : "Connect Wallet"
          )}
        </SkewButton>

        {/* Mobile Menu Icon */}
        <button className="lg:hidden text-white">
            <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  );
};

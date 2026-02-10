import React, { useState, useEffect } from 'react';
import { hashconnect, initializeHashConnect, getHashConnectState } from '../../services/hashconnect';

export const HealthCheck = () => {
    const [status, setStatus] = useState({
        bridge: false, // isBridgeReady logic
        wallet: false, // extensionFound
        relay: false, // Connection status (inferred)
        topic: '',
        pairingString: ''
    });

    useEffect(() => {
        const updateStatus = () => {
            const state = getHashConnectState();
            // In HashConnect v3, pairingString presence implies partial readiness
            // We use the event 'hashconnect-ready' to set bridge=true in Navbar,
            // here we can check if topic exists or if we heard the ready event.
            // For simplicity, we'll re-check the global state.

            // We can infer relay status from whether we have a topic or pairing string without error
            const isRelayActive = !!state.pairingString || (state.topic && state.topic !== "Unknown");

            setStatus({
                bridge: true, // If this component mounts and updateStatus runs after init, we assume init passed the blocking stage
                wallet: state.extensionFound,
                relay: isRelayActive,
                topic: state.topic,
                pairingString: state.pairingString
            });
        };

        const interval = setInterval(updateStatus, 1000);
        window.addEventListener('hashconnect-ready', updateStatus);

        return () => {
            clearInterval(interval);
            window.removeEventListener('hashconnect-ready', updateStatus);
        };
    }, []);

    const handleReconnect = () => {
        console.log("Forcing Manual Reconnect...");
        initializeHashConnect();
    };

    return (
        <div className="fixed bottom-0 left-0 w-full bg-black border-t border-primary p-2 z-[9999] font-mono text-[10px] text-primary flex items-center justify-between opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status.bridge ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                    <span>BRIDGE</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status.wallet ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>WALLET</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status.relay ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>RELAY</span>
                </div>
            </div>

            <div className="hidden md:flex gap-4 text-gray-400">
                <span>TOPIC: {status.topic.substring(0, 10)}...</span>
                <span>PAIR: {status.pairingString ? 'GENERATED' : 'WAITING...'}</span>
            </div>

            {!status.relay && (
                <button
                    onClick={handleReconnect}
                    className="border border-red-500 text-red-500 px-2 hover:bg-red-500 hover:text-black transition-colors uppercase"
                >
                    RECONNECT
                </button>
            )}
        </div>
    );
};

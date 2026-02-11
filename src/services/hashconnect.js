import { HashConnect } from 'hashconnect';
import { LedgerId } from '@hashgraph/sdk';

const appMetadata = {
    name: 'HashPlay AI',
    description: 'AI-Powered Web3 Gaming',
    icons: ['https://hashplayai.vercel.app/logo.png'],
    url: 'https://hashplayai.vercel.app'
};

// Retrieve Project ID from environment variables
const PROJECT_ID = import.meta.env.VITE_HASHCONNECT_PROJECT_ID;

if (!PROJECT_ID) {
    throw new Error('VITE_HASHCONNECT_PROJECT_ID environment variable is missing. Please add it to your .env file.');
}

export const hashconnect = new HashConnect(
    LedgerId.TESTNET,
    PROJECT_ID,
    appMetadata,
    true
);

// Register events before calling init()
if (hashconnect.pairingEvent) {
    hashconnect.pairingEvent.on((pairingData) => {
        console.log('Pairing Event:', pairingData);
        // Save pairing data to localStorage for persistence
        if (pairingData) {
            localStorage.setItem('hashconnectData', JSON.stringify(pairingData));
            // Trigger a custom event so React components can update
            window.dispatchEvent(new Event('hashconnect-pairing'));
        }
    });
}

if (hashconnect.disconnectionEvent) {
    hashconnect.disconnectionEvent.on((data) => {
        console.log('Disconnection Event:', data);
        localStorage.removeItem('hashconnectData');
        window.dispatchEvent(new Event('hashconnect-pairing'));
    });
}

if (hashconnect.connectionStatusChangeEvent) {
    hashconnect.connectionStatusChangeEvent.on((connectionStatus) => {
        console.log('Connection Status Change:', connectionStatus);
    });
}

let extensionFound = false;

if (hashconnect.foundExtensionEvent) {
    hashconnect.foundExtensionEvent.on((walletMetadata) => {
        console.log('Found Extension:', walletMetadata);
        extensionFound = true;
    });
}

// Initialize
export const initializeHashConnect = async () => {
    try {
        // Clean Handshake: Wipe any 'ghost' sessions
        localStorage.clear();
        if (hashconnect.clearConnectionsAndData) {
            await hashconnect.clearConnectionsAndData();
        }

        // Bypass Relay Hang: Force ready after 3 seconds if init hangs
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('timeout'), 3000));
        const initPromise = hashconnect.init();

        const result = await Promise.race([initPromise, timeoutPromise]);

        if (result === 'timeout') {
            console.warn('HashConnect Initialization Timed Out - Forcing Ready State');
        } else {
            console.log('HashConnect Initialized', result);
        }

        // Debug Logging: Verify handshake
        if (hashconnect.hcData && hashconnect.hcData.pairingString) {
             console.log('Pairing String:', hashconnect.hcData.pairingString);
        }
    } catch (error) {
        console.error('HashConnect Initialization Error:', error);
    } finally {
        // Force the app to become interactive regardless of WebSocket state
        window.dispatchEvent(new Event('hashconnect-ready'));
    }
};

export const getHashConnectState = () => {
    return {
        topic: hashconnect.hcData?.topic || "Unknown",
        pairingString: hashconnect.hcData?.pairingString || "",
        extensionFound: extensionFound
    };
};

export const disconnectWallet = async () => {
    try {
        if (hashconnect.disconnect) {
            await hashconnect.disconnect();
        }
        if (hashconnect.clearConnectionsAndData) {
            await hashconnect.clearConnectionsAndData();
        }
        localStorage.removeItem('hashconnectData');
        localStorage.clear();
    } catch (e) {
        console.error("Disconnect error", e);
    }
};

export const getSigner = (accountId) => {
    return hashconnect.getSigner(accountId);
};

export const openModal = async () => {
    console.log('Opening HashConnect modal');

    // Clear Ghost Sessions: Force fresh pairing request
    try {
        await hashconnect.clearConnectionsAndData();
        localStorage.removeItem('hashconnectData');
    } catch (e) {
        console.warn('Failed to clear connections (non-fatal):', e);
    }

    // The 800ms Warm-up Delay: Allow WebSocket relay to generate pairing string
    console.log('Initiating Warm-up Delay (800ms)...');
    setTimeout(() => {
        console.log('Opening Pairing Modal now...');
        hashconnect.openPairingModal();
    }, 800);
};

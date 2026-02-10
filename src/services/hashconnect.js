import { HashConnect } from 'hashconnect';
import { LedgerId } from '@hashgraph/sdk';

const appMetadata = {
    name: 'HashPlay AI',
    description: 'AI-Powered Web3 Gaming',
    icons: ['https://hashplayai.vercel.app/logo.png'],
    url: 'https://hashplayai.vercel.app'
};

// Placeholder Project ID as requested
const PROJECT_ID = 'e75582c66a8226305655dcbc1b75d53f';

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

        // Manual Relay & Timeout: Force ready after 5 seconds if init hangs
        // Note: HashConnect v3 manages relay internally, but this timeout handles stalled connections
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('timeout'), 5000));
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

    // Clear stale pairing string if accessible (best effort based on v3 SDK structure)
    if (hashconnect.hcData) {
        hashconnect.hcData.pairingString = '';
    }

    // Delay 1s to allow extension bridge to stabilize if it was just loaded
    // Master Reset Verification: Increased from 800ms to 1000ms per user request
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (extensionFound) {
        console.log('Extension found, proceeding with connection...');
        hashconnect.connectToLocalWallet();
    } else {
        console.log('Extension not found, opening pairing modal...');
        hashconnect.openPairingModal();
    }
};

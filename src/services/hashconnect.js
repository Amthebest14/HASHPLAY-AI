import { HashConnect } from 'hashconnect';
import { LedgerId } from '@hashgraph/sdk';

const appMetadata = {
    name: 'HashPlay AI',
    description: 'AI-Powered P2E Gaming',
    url: 'https://localhost:3000'
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
        // Clear stale sessions before init to ensure fresh connection
        localStorage.removeItem('hashconnectData');
        if (hashconnect.clearConnectionsAndData) {
            await hashconnect.clearConnectionsAndData();
        }

        const initData = await hashconnect.init();
        console.log('HashConnect Initialized', initData);

        if (hashconnect.hcData && hashconnect.hcData.pairingString) {
             console.log('Pairing String:', hashconnect.hcData.pairingString);
        }
    } catch (error) {
        console.error('HashConnect Initialization Error:', error);
    }
};

export const getSigner = (accountId) => {
    return hashconnect.getSigner(accountId);
};

export const openModal = () => {
    console.log('Opening HashConnect modal (with 800ms delay)');

    // Clear stale pairing string if accessible (best effort based on v3 SDK structure)
    if (hashconnect.hcData) {
        hashconnect.hcData.pairingString = '';
    }

    if (extensionFound) {
        console.log('Extension found, proceeding with connection...');
        hashconnect.connectToLocalWallet();
    } else {
        console.log('Extension not found, opening pairing modal...');
        setTimeout(() => {
            hashconnect.openPairingModal();
        }, 800);
    }
};

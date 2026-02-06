import { HashConnect } from 'hashconnect';
import { LedgerId } from '@hashgraph/sdk';

const appMetadata = {
    name: 'HashPlay AI',
    description: 'AI-Powered P2E Gaming',
    url: 'http://localhost:3000'
};

// Placeholder Project ID as requested
const PROJECT_ID = '6465d42903496525145893';

export const hashconnect = new HashConnect(
    LedgerId.TESTNET,
    PROJECT_ID,
    appMetadata,
    true
);

// Register events before calling init()
hashconnect.pairingEvent.on((pairingData) => {
    console.log('Pairing Event:', pairingData);
    // Save pairing data to localStorage for persistence
    if (pairingData) {
        localStorage.setItem('hashconnectData', JSON.stringify(pairingData));
        // Trigger a custom event so React components can update
        window.dispatchEvent(new Event('hashconnect-pairing'));
    }
});

hashconnect.disconnectionEvent.on((data) => {
    console.log('Disconnection Event:', data);
    localStorage.removeItem('hashconnectData');
    window.dispatchEvent(new Event('hashconnect-pairing'));
});

hashconnect.connectionStatusChangeEvent.on((connectionStatus) => {
    console.log('Connection Status Change:', connectionStatus);
});

// Initialize
const initializeHashConnect = async () => {
    try {
        const initData = await hashconnect.init();
        console.log('HashConnect Initialized', initData);
        // Check if we have saved data
        const savedData = localStorage.getItem('hashconnectData');
        if (savedData) {
            // We might want to re-establish or check pairing, but v3 usually handles state internally or via initData
            // If initData contains saved pairings, we are good.
        }
    } catch (error) {
        console.error('HashConnect Initialization Error:', error);
    }
};

initializeHashConnect();

export const getSigner = (accountId) => {
    return hashconnect.getSigner(accountId);
};

export const openModal = () => {
    console.log('Opening HashConnect modal');
    hashconnect.openPairingModal();
};

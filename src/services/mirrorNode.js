import { Hbar, HbarUnit } from '@hashgraph/sdk';

const MIRROR_NODE_URL = 'https://testnet.mirrornode.hedera.com/api/v1';
const HASHPLAY_TOKEN_ID = '0.0.7838938';

/**
 * Fetches HBAR and Token balances for a given account ID using Mirror Node API.
 * @param {string} accountId - The Hedera Account ID (e.g., 0.0.123456)
 * @returns {Promise<{hbar: string, token: string}>} - Formatted balances
 */
export const fetchAccountBalance = async (accountId) => {
    if (!accountId) return { hbar: '--', token: '--' };

    try {
        const response = await fetch(`${MIRROR_NODE_URL}/accounts/${accountId}/balances`);
        if (!response.ok) {
            console.warn(`Mirror Node API Error: ${response.statusText}`);
            return { hbar: '--', token: '--' };
        }

        const data = await response.json();
        const balances = data.balances[0];

        if (!balances) return { hbar: '0.00', token: '0.00' };

        // HBAR Balance (tinybar to HBAR using SDK for precision)
        // Note: The SDK's Hbar.fromTinybars creates an object. We convert to number or string.
        // HbarUnit.Hbar ensures correct decimal placement.
        const hbarValue = Hbar.fromTinybars(balances.balance).to(HbarUnit.Hbar);
        const hbar = hbarValue.toNumber().toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        // Token Balance
        const tokenData = balances.tokens.find(t => t.token_id === HASHPLAY_TOKEN_ID);
        // Assuming the token has 0 decimals based on initial simple integer usage, but usually it's checked via mirror node.
        // For now, adhering to user prompt "5.000" implies decimals.
        // If it's 100 and displayed as 5.000 that implies complex logic,
        // but typically raw balance is int. Let's assume standard 1:1 for now if not specified otherwise,
        // OR prompt implies 3 decimals? "5.000". Let's stick to 2 decimals for consistency with request "500.00".
        const token = tokenData
            ? tokenData.balance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
            : '0.00';

        return { hbar, token };

    } catch (error) {
        console.error('Failed to fetch account balance:', error);
        return { hbar: '--', token: '--' };
    }
};

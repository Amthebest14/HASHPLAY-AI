const MIRROR_NODE_URL = 'https://testnet.mirrornode.hedera.com/api/v1';
const HASHPLAY_TOKEN_ID = '0.0.7838938';

/**
 * Fetches HBAR and Token balances for a given account ID.
 * @param {string} accountId - The Hedera Account ID (e.g., 0.0.123456)
 * @returns {Promise<{hbar: string, token: string}>} - Formatted balances
 */
export const fetchAccountBalance = async (accountId) => {
    if (!accountId) return { hbar: '0', token: '0' };

    try {
        const response = await fetch(`${MIRROR_NODE_URL}/accounts/${accountId}/balances`);
        if (!response.ok) {
            throw new Error(`Mirror Node API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const balances = data.balances[0];

        if (!balances) return { hbar: '0', token: '0' };

        // HBAR Balance (tinybar to HBAR)
        const hbar = (balances.balance / 100_000_000).toLocaleString('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 0
        });

        // Token Balance
        const tokenData = balances.tokens.find(t => t.token_id === HASHPLAY_TOKEN_ID);
        const token = tokenData
            ? tokenData.balance.toLocaleString('en-US')
            : '0';

        return { hbar, token };

    } catch (error) {
        console.error('Failed to fetch account balance:', error);
        return { hbar: '0', token: '0' };
    }
};

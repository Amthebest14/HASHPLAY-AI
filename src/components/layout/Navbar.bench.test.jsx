import { render } from '@testing-library/react';
import { Navbar } from './Navbar';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

// Mock dependencies to avoid side effects/errors
vi.mock('../../services/hashconnect', () => ({
    hashconnect: {
        pairingEvent: { on: vi.fn() },
        disconnectionEvent: { on: vi.fn() },
        connectionStatusChangeEvent: { on: vi.fn() },
        foundExtensionEvent: { on: vi.fn() },
        hcData: { topic: 'test', pairingString: 'test' }
    },
    openModal: vi.fn(),
    disconnectWallet: vi.fn(),
}));

vi.mock('../../services/mirrorNode', () => ({
    fetchAccountBalance: vi.fn().mockResolvedValue({ hbar: '100', token: '50' }),
}));

describe('Navbar Performance', () => {
    it('renders without crashing', () => {
        const { getByText } = render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );
        expect(getByText('Floor')).toBeDefined();
    });

    it('measures render time (100 iterations)', () => {
        const start = performance.now();
        for (let i = 0; i < 100; i++) {
            render(
                <MemoryRouter>
                    <Navbar />
                </MemoryRouter>
            );
        }
        const end = performance.now();
        console.log(`100 renders took ${end - start}ms`);
    });
});

import React from 'react';
import { Layout } from '../components/layout/Layout';
import { DiceModule } from '../components/DiceModule';
import { CoinModule } from '../components/CoinModule';

export const MainFloor = () => {
    return (
        <Layout>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full w-full flex-grow">
                <DiceModule />
                <CoinModule />
            </div>
        </Layout>
    );
};

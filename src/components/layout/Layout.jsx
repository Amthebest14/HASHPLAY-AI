import React from 'react';
import clsx from 'clsx';
import { Navbar } from './Navbar';
import { TickerFooter } from './TickerFooter';

export const Layout = ({ children, noPadding = false }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark overflow-x-hidden text-white font-display">
      <Navbar />
      <main className={clsx("flex-grow flex flex-col w-full max-w-[1440px] mx-auto", !noPadding && "p-4 md:p-6 lg:p-8")}>
        {children}
      </main>
      <TickerFooter />
    </div>
  );
};

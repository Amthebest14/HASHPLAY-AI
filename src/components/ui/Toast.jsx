import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export const Toast = ({ message, type = 'info', onClose }) => {
  const isError = type === 'error';
  const isSuccess = type === 'success';

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className={clsx(
        "bg-panel border-2 clip-corner-tl-br p-4 pointer-events-auto min-w-[300px] flex items-center justify-between shadow-lg backdrop-blur-sm",
        isError ? "border-red-500" :
        isSuccess ? "border-green-500" :
        "border-primary"
      )}
    >
      <div className="flex flex-col">
        <span className={clsx(
            "text-xs font-mono uppercase tracking-widest opacity-70",
            isError ? "text-red-500" :
            isSuccess ? "text-green-500" :
            "text-primary"
        )}>
          {isError ? "SYSTEM ALERT" : isSuccess ? "SUCCESS" : "NOTIFICATION"}
        </span>
        <span className="font-bold text-white mt-1 text-sm">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-white transition-colors text-xl leading-none"
      >
        &times;
      </button>
    </motion.div>
  );
};

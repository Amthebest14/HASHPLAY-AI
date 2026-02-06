import { Buffer } from 'buffer';
import process from 'process';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Polyfills for HashConnect
window.global = window;
window.Buffer = Buffer;
window.process = process;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

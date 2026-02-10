// The Polyfill Hammer: Explicit window globals for wallet encryption
import { Buffer } from 'buffer';
window.Buffer = Buffer;
window.process = { env: {} };

import './polyfills';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

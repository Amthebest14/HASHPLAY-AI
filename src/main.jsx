// The Polyfill Hammer: Explicit window globals for wallet encryption
window.global = window;
window.Buffer = window.Buffer || require('buffer').Buffer;
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

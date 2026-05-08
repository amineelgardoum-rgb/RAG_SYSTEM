import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import logger from './utils/logger.js'

// Capture global errors
window.addEventListener('error', (event) => {
  logger.error('Global Error', {
    message: event.message,
    source: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error?.stack
  });
});

// Capture unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled Promise Rejection', {
    reason: event.reason?.stack || event.reason
  });
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Error handler to suppress common harmless errors
export const setupErrorSuppression = () => {
  // Suppress CORS header errors
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('Refused to get unsafe header') || 
        message.includes('x-rtb-fingerprint-id')) {
      return; // Suppress these errors
    }
    originalConsoleError.apply(console, args);
  };

  // Suppress SVG attribute errors
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    const message = args.join(' ');
    if (message.includes('Expected length') && message.includes('auto')) {
      return; // Suppress SVG auto dimension errors
    }
    originalConsoleWarn.apply(console, args);
  };

  // Suppress MutationObserver errors
  window.addEventListener('error', (event) => {
    if (event.message.includes('MutationObserver') && 
        event.message.includes('parameter 1 is not of type')) {
      event.preventDefault();
      return false;
    }
  });
};

// Call this in your main App component
export default setupErrorSuppression;

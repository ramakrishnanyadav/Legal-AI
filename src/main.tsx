import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Remove initial loader
const removeInitialLoader = () => {
  const loader = document.querySelector('.initial-loader');
  if (loader) {
    loader.remove();
  }
};

// Performance monitoring
const reportWebVitals = () => {
  if ('PerformanceObserver' in window) {
    // Report to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Performance] Web Vitals monitoring active');
    }
  }
};

// Register service worker for PWA
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('[SW] Service Worker registered');
    } catch (error) {
      console.log('[SW] Service Worker registration failed:', error);
    }
  }
};

// Initialize app
const init = () => {
  removeInitialLoader();
  reportWebVitals();
  registerServiceWorker();
  
  createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
};

init();

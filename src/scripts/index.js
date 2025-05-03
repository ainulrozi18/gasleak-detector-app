import 'regenerator-runtime';
import '../styles/style.css';
import '../styles/responsive.css';
import '../styles/circle-progress.css';
import '../styles/about.css';
import '../styles/chart.css';
import './components/connected-status'
import App from './views/app';
import { showConnectionStatusAlert } from './utils/alertManager';
import { updateStatus } from './globals/mqtt-client';
import { setupPusshNotifications } from './utils/pushManager';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    setupPusshNotifications()
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => console.log('✅ Service Worker registered'))
      .catch(err => console.error('❌ Service Worker registration failed', err));
  });
}

const app = new App({
  content: document.querySelector('#mainContent'),
});

window.addEventListener('hashchange', () => {
  app.renderPage();
});

window.addEventListener('load', () => {
  updateConnectionStatus();
  app.renderPage();
});

function updateConnectionStatus() {
  if(navigator.onLine) {
    showConnectionStatusAlert("Koneksi internet terhubung")
    updateStatus("Terhubung")
  } else {
    showConnectionStatusAlert("Koneksi internet terputus") 
    updateStatus("Terputus")
  }
}
// Menambahkan event listener untuk mendeteksi perubahan status koneksi secara real-time
window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);
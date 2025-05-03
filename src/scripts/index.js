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
import { registerPush, setupPusshNotifications } from './utils/pushManager';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('✅ Service Worker registered', reg))
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
  setupPusshNotifications()
  registerPush()
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
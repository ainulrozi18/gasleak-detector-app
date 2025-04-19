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
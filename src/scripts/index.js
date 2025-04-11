import 'regenerator-runtime';
import '../styles/style.css';
import '../styles/responsive.css';
import '../styles/circle-progress.css';
import '../styles/about.css';
import '../styles/chart.css';
import './components/connected-status'
import App from './views/app';
import { registerServiceWorker } from './utils';

const app = new App({
  content: document.querySelector('#mainContent'),
});

window.addEventListener('hashchange', () => {
  app.renderPage();
});

window.addEventListener('load', () => {
  registerServiceWorker()
  app.renderPage();
});
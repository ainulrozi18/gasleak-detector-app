import UrlParser from "../routes/url-parser";
import routes from "../routes/routes";
import { connectMQTT } from "../globals/mqtt-client";
import { registerPush } from "../utils/pushManager";

class App {
  constructor({ content }) {
    this._content = content;
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    this._manageConnectedStatus(url);
    const page = routes[url];
    this._content.innerHTML = await page.render();
    await page.afterRender();
    connectMQTT();

   registerPush();
  }

  _manageConnectedStatus(url) {
    const connectedStatus = document.querySelector("connected-status");
    if (connectedStatus) {
      if (url === "/about") {
        connectedStatus.setAttribute('hidden', true)
      } else {
        connectedStatus.removeAttribute('hidden')
      }
    } else {
      return;
    }
  }
}

export default App;

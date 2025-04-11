import UrlParser from "../routes/url-parser";
import routes from "../routes/routes";
import { connectMQTT } from "../globals/mqtt-client";
import { subscribe } from "../utils/notification-helper";
import { isServiceWorkerAvailable } from "../utils";
import { registerPush } from "../utils/pushManager";

class App {
  constructor({ content }) {
    this._content = content;
    // this.initialAppShel();
  }

  // _initialAppShel(){
  // this.content = this._content;
  // }

  // async #setupPushNotification() {
  //   subscribe();
  // }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[url];
    this._content.innerHTML = await page.render();
    await page.afterRender();
    connectMQTT();

    // if (isServiceWorkerAvailable()) {
    //   this.#setupPushNotification();
    // }

    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.register("/sw.bundle.js").then(() => {
        registerPush();
      });
    }
  }
}

export default App;

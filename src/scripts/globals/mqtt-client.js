import { CONFIG } from "./config.js";
import API_ENDPOINT from "./api-endpoint.js";

let tempOfStatus;
let mqttListenerAdded = false;

export function connectMQTT() {
  if (!mqttListenerAdded) {
    // Daftarkan event listener hanya sekali
    API_ENDPOINT.CLIENT.on("connect", function () {
      console.log("✅ Terhubung ke MQTT Broker");
      tempOfStatus = "Terhubung";
      updateStatus(tempOfStatus);

      API_ENDPOINT.CLIENT.subscribe(
        [CONFIG.TOPIC_GAS, CONFIG.TOPIC_FLAME],
        function (err) {
          if (!err) {
            console.log("📡 Berlangganan ke topik:", CONFIG.TOPIC_GAS, "dan", CONFIG.TOPIC_FLAME);
          }
        }
      );
    });

    API_ENDPOINT.CLIENT.on("error", function (err) {
      console.error("❌ Koneksi MQTT Gagal:", err);
      tempOfStatus = "Gagal Terhubung";
      updateStatus(tempOfStatus);
    });

    API_ENDPOINT.CLIENT.on("offline", function () {
      console.warn("⚠️ Koneksi Terputus");
      tempOfStatus = "Terputus";
      updateStatus(tempOfStatus);
    });

    API_ENDPOINT.CLIENT.on("reconnect", function () {
      tempOfStatus = "Menyambungkan";
      updateStatus(tempOfStatus);
    });

    mqttListenerAdded = true;
  }

  // Update status awal jika belum ada
  if (tempOfStatus === undefined) tempOfStatus = "Menyambungkan";
  updateStatus(tempOfStatus);
}

export function updateStatus(status) {
  const connectedStatus = document.querySelector("connected-status");
  if (connectedStatus) connectedStatus.setAttribute("status", status);
  else return;
}
let callbacks = {};
let isInitialized = false;

export function getMQTTData(topic, callback) {
  callbacks[topic] = callback;

  if (!isInitialized) {
    API_ENDPOINT.CLIENT.on("message", (topic, message) => {
      if (callbacks[topic]) {
        callbacks[topic](topic, message.toString());
      }
    });
    isInitialized = true;
  }
}

export function removeMQTTCallback(topic) {
  delete callbacks[topic];
}

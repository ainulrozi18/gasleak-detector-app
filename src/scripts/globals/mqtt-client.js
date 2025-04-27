import {CONFIG} from './config.js';
import API_ENDPOINT from './api-endpoint.js';

// Fungsi untuk menghubungkan ke MQTT Broker
let tempOfStatus;
export function connectMQTT() {
    API_ENDPOINT.CLIENT.on("connect", function () {
        console.log("✅ Terhubung ke MQTT Broker");
        tempOfStatus = "Terhubung"
        updateStatus(tempOfStatus)
        API_ENDPOINT.CLIENT.subscribe([CONFIG.TOPIC_GAS, CONFIG.TOPIC_FLAME], function (err) {
            if (!err) {
                console.log("📡 Berlangganan ke topik:", CONFIG.TOPIC_GAS, "dan", CONFIG.TOPIC_FLAME);
            }
        });
    });
    
    API_ENDPOINT.CLIENT.on("error", function (err) {
        console.error("❌ Koneksi MQTT Gagal:", err);
        tempOfStatus = "Gagal Terhubung";
        updateStatus(tempOfStatus)
    });
    
    API_ENDPOINT.CLIENT.on("offline", function () {
        console.warn("⚠️ Koneksi Terputus");
        tempOfStatus = "Terputus";
        updateStatus(tempOfStatus)
    });
    
    API_ENDPOINT.CLIENT.on("reconnect", function () {
        tempOfStatus = "Menyambungkan";
        updateStatus(tempOfStatus)
    });
    if(tempOfStatus === undefined) tempOfStatus = "Menyambungkan"
    updateStatus(tempOfStatus)
}

export function updateStatus(status) {
    const connectedStatus = document.querySelector('connected-status');
    if(connectedStatus) connectedStatus.setAttribute('status', status);
    else return;
}

// Fungsi untuk menangkap pesan dan mengembalikan data
// let currentCallback = null;

// export function getMQTTData(callback) {
//   // Hapus listener sebelumnya jika ada
//   if (currentCallback) {
//     API_ENDPOINT.CLIENT.removeListener("message", currentCallback);
//   }
  
//   // Simpan callback baru
//   currentCallback = function(topic, message) {
//     let data = message.toString();
//     if (callback) callback(topic, data);
//   };
  
//   // Daftarkan callback baru
//   API_ENDPOINT.CLIENT.on("message", currentCallback);
// }

// mqtt-client.js
let callbacks = {};
let isInitialized = false;

export function getMQTTData(topic, callback) {
  // Daftarkan callback
  callbacks[topic] = callback;
  
  // Inisialisasi handler sekali saja
  if (!isInitialized) {
    API_ENDPOINT.CLIENT.on("message", (topic, message) => {
      if (callbacks[topic]) {
        callbacks[topic](topic, message.toString());
      }
    });
    isInitialized = true;
  }
}

// Tambahkan fungsi untuk menghapus callback
export function removeMQTTCallback(topic) {
  delete callbacks[topic];
}
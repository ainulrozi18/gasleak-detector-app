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
export function getMQTTData(callback) {
    API_ENDPOINT.CLIENT.on("message", function (topic, message) {
        let data = message.toString();
        // Kirim data ke callback
        if (callback) callback(topic, data);
    });
}
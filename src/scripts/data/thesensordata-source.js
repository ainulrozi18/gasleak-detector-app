import { CONFIG } from "../globals/config";
import { getMQTTData } from "../globals/mqtt-client";
import { showApiAlert, showGasAlert } from "../utils/alertManager";
import Home from "../views/pages/home";

// Simpan status notifikasi untuk setiap rentang
const notifTriggered = {
  safe: false,
  careful: false,
  alert: false,
  danger: false,
  safeFlame: false,
  dangerFlame: false,
};

// Reset notifikasi jika keluar dari rentang
function resetNotifFlags(rangeToKeep) {
  Object.keys(notifTriggered).forEach((range) => {
    if (range !== rangeToKeep) {
      notifTriggered[range] = false;
    }
  });
}

let lastGasRange = null;
let title;

const checkGasClasification = (data, colorCircleProgress, stops) => {
  let gasClasification, colorGasClassification, stopClassificationColor, messageOfGas;
  const changeColorGasClasification = (classification) => {
    return colorCircleProgress.forEach((clrCircleProg) => {
      clrCircleProg.classList = "";
      clrCircleProg.classList.add(classification);
    });
  };

  const changeStopsColor = (stopClassificationColor) => {
    return stops.forEach((stop) => {
      stop.style.stopColor = stopClassificationColor;
    });
  };

  let currentRange;

  switch (true) {
    case data < 610:
      gasClasification = "Aman";
      colorGasClassification = "safe-gas";
      stopClassificationColor = "green"
      currentRange = "safe";
      break;

    case data >= 610 && data < 800:
      gasClasification = "Hati-hati";
      colorGasClassification = "careful-gas";
      stopClassificationColor = "yellow"
      currentRange = "careful";
      messageOfGas = "Kadar gas melebihi 610 PPM, Segera cek untuk pencegahan dini"
      title = `Terdeteksi Gas! (${gasClasification})`

      // Panggil notifikasi hanya jika rentang berbeda dari sebelumnya
      if (lastGasRange !== currentRange) {
        triggerNotif(title, messageOfGas);
        showGasAlert(messageOfGas)
      }
      break;

    case data >= 800 && data < 1000:
      gasClasification = "Waspada";
      colorGasClassification = "alert-gas";
      stopClassificationColor = "orange"
      currentRange = "alert";
      messageOfGas = "Kadar gas melebihi 800 PPM, Segera cek dan keluarkan gas LPG kamu ke ruangan terbuka!"
      title = `Terdeteksi Gas! (${gasClasification})`

      // Panggil notifikasi hanya jika rentang berbeda dari sebelumnya
      if (lastGasRange !== currentRange) {
        triggerNotif(title, messageOfGas);
        showGasAlert(messageOfGas)
      }
      break;

    case data >= 1000:
      gasClasification = "Bahaya";
      colorGasClassification = "danger-gas";
      stopClassificationColor = "red"
      currentRange = "danger";
      messageOfGas = "Kadar gas melebihi 1000 PPM, Segera keluarkan gas LPG kamu ke ruangan terbuka, jangan menyalakan api dan matikan listrik!"
      title = `Terdeteksi Gas! (${gasClasification})`

      // Panggil notifikasi hanya jika rentang berbeda dari sebelumnya
      if (lastGasRange !== currentRange) {
        triggerNotif(title, messageOfGas);
        showGasAlert(messageOfGas)
      }
      break;

    default:
      break;
  }

  // Update warna dan klasifikasi
  changeColorGasClasification(colorGasClassification);
  changeStopsColor(stopClassificationColor);

  // Simpan rentang saat ini untuk perbandingan berikutnya
  lastGasRange = currentRange;

  return gasClasification;
};

const updateBuzzerStatus = (data) => {
  const buzzerStatusElement = document.querySelector('connected-status');
  let buzzerStatus;
  if(buzzerStatusElement) {
    const buzzerImageELement = document.querySelector('.buzzer-image')
    const backgroundBuzzerRing = document.querySelector('.connectedStatus__buzzer div')
    if(data >= 610) {
      buzzerStatus = "aktif"
      buzzerImageELement.style.animation = "buzzerRing .25s ease-in-out infinite";
      backgroundBuzzerRing.style.animation = "blinkBackgroundBuzzerRing .25s ease-in-out infinite";
    } 
    else {
      buzzerStatus = "non-aktif"
      buzzerImageELement.style.animation = "none"
      backgroundBuzzerRing.style.animation = "none";
    } 
    buzzerStatusElement.setAttribute('buzzer-text', `Buzzer ${buzzerStatus}` );
  }
}

export const catchMessageGasData = (
  gasClasification,
  gasStatus,
  gasValue,
  circle,
  colorCircleProgress,
  stops
) => {
  // Hubungkan ke MQTT
  let gasLPGValue = gasValue;
  // Tangkap pesan MQTT dan ubah tampilan halaman
  getMQTTData(function (topic, data) {
    if (topic === "iot/gas") {
      function updateCircleProgress(gasValue) {
        const maxGasValue = 1000;

        // Hitung persentase dari gasValue
        const percentage = (gasValue / maxGasValue) * 100;

        // Hitung stroke-dashoffset baru
        const radius = 100; // Radius lingkaran
        const circumference = 2 * Math.PI * radius; // Keliling lingkaran
        const offset = circumference - (circumference * percentage) / 100;

        // Update stroke-dashoffset
        circle.style.strokeDashoffset = offset;
        // Update teks gasValue
        gasLPGValue.innerHTML = gasValue;
        gasLPGValue.style.color = "#fff";
      }
      updateCircleProgress(data);
      Home.updateGasStatus(data);
      const checkStatusGas = data >= 610 ? "Terdeteksi" : "Aman";
      updateBuzzerStatus(data)

      gasStatus.innerHTML = checkStatusGas;
      gasClasification.innerHTML = checkGasClasification(
        data,
        colorCircleProgress,
        stops
      );
    }
  });
};

export const catchMessageFlameData = (
  flameValue,
  flameStatus,
  lineProgressFlame,
  lineProgressFlameLayer
) => {
  // Tangkap pesan MQTT dan ubah tampilan halaman
  getMQTTData(function (topic, data) {
    if (topic === "iot/flame") {
      flameValue.forEach((flameValueEl) => {
        flameValueEl.innerHTML = data;
      });
      const checkStatusFlame = data == 1 ? "Terdeteksi" : "Aman";
      if (data == 1) {
        lineProgressFlame.classList.add("danger-flame");
        lineProgressFlameLayer.classList.add("danger-flame-layer");
        lineProgressFlame.classList.remove("safe-flame");
        lineProgressFlameLayer.classList.remove("safe-flame-layer");
        title = `Terdeteksi Api!`;
        if (!notifTriggered.dangerFlame) {
          triggerNotif(title, "Terdeteksi Api! Segera cek gas LPG kamu!");
          showApiAlert()
          notifTriggered.danger = true;
        }
        resetNotifFlags("careful"); // Reset notif rentang lain
      } else {
        lineProgressFlame.classList.remove("danger-flame");
        lineProgressFlameLayer.classList.remove("danger-flame-layer");
        lineProgressFlame.classList.add("safe-flame");
        lineProgressFlameLayer.classList.add("safe-flame-layer");
        resetNotifFlags("safeFlame");
      }
      flameStatus.innerHTML = checkStatusFlame;
    }
  });
};

async function triggerNotif(title, message) {
  try {
    const response = await fetch(`${CONFIG.BACKEND_URL}/trigger-notification`, {
      method: "POST",
      body: JSON.stringify({ title, message }),
      headers: { "Content-Type": "application/json" },
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    console.log("Notification triggered successfully:", await response.json());
  } catch (error) {
    console.error("Error triggering notification:", error);
  }
}

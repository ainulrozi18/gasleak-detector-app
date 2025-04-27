// import { CONFIG } from "../globals/config";
// import { getMQTTData } from "../globals/mqtt-client";
// import { showApiAlert, showGasAlert } from "../utils/alertManager";
// import Home from "../views/pages/home";

// // Simpan status notifikasi untuk setiap rentang
// const notifTriggered = {
//   safe: false,
//   careful: false,
//   alert: false,
//   danger: false,
//   safeFlame: false,
//   dangerFlame: false,
// };

// // Reset notifikasi jika keluar dari rentang
// function resetNotifFlags(rangeToKeep) {
//   Object.keys(notifTriggered).forEach((range) => {
//     if (range !== rangeToKeep) {
//       notifTriggered[range] = false;
//     }
//   });
// }

// let lastGasRange = null;
// let title;

// export const checkGasClasification = (data, colorCircleProgress, stops) => {
//   let gasClasification, colorGasClassification, stopClassificationColor, messageOfGas;

//   if (!colorCircleProgress || !stops) {
//     console.error('Invalid parameters to checkGasClasification');
//     return;
//   }
//   const changeColorGasClasification = (classification) => {
//     return colorCircleProgress.forEach((clrCircleProg) => {
//       clrCircleProg.classList = "";
//       clrCircleProg.classList.add(classification);
//     });
//   };

//   const changeStopsColor = (stopClassificationColor) => {
//     return stops.forEach((stop) => {
//       stop.style.stopColor = stopClassificationColor;
//     });
//   };

//   let currentRange;
//   let shouldSendNotification = false;

//   switch (true) {
//     case data < 610:
//       currentRange = "safe";
//       gasClasification = "Aman";
//       colorGasClassification = "safe-gas";
//       stopClassificationColor = "green";
//       // Reset lastGasRange ketika kembali ke kondisi aman
//       if (lastGasRange !== "safe") {
//         lastGasRange = "safe";
//       }
//       break;

//     case data >= 610 && data < 800:
//       currentRange = "careful";
//       gasClasification = "Hati-hati";
//       colorGasClassification = "careful-gas";
//       stopClassificationColor = "yellow";
//       messageOfGas = "Kadar gas melebihi 610 PPM, Segera cek untuk pencegahan dini";
//       title = `Terdeteksi Gas! (${gasClasification})`;
//       shouldSendNotification = lastGasRange !== currentRange;
//       break;

//     case data >= 800 && data < 1000:
//       currentRange = "alert";
//       gasClasification = "Waspada";
//       colorGasClassification = "alert-gas";
//       stopClassificationColor = "orange";
//       messageOfGas = "Kadar gas melebihi 800 PPM, Segera cek dan keluarkan gas LPG kamu ke ruangan terbuka!";
//       title = `Terdeteksi Gas! (${gasClasification})`;
//       shouldSendNotification = lastGasRange !== currentRange;
//       break;

//     case data >= 1000:
//       currentRange = "danger";
//       gasClasification = "Bahaya";
//       colorGasClassification = "danger-gas";
//       stopClassificationColor = "red";
//       messageOfGas = "Kadar gas melebihi 1000 PPM, Segera keluarkan gas LPG kamu ke ruangan terbuka, jangan menyalakan api dan matikan listrik!";
//       title = `Terdeteksi Gas! (${gasClasification})`;
//       shouldSendNotification = lastGasRange !== currentRange;
//       break;

//     default:
//       break;
//   }

//   // Kirim notifikasi jika diperlukan
//   if (shouldSendNotification && messageOfGas && title) {
//     triggerNotif(title, messageOfGas);
//     showGasAlert(messageOfGas);
//   }
  
//   // Update warna dan klasifikasi
//   changeColorGasClasification(colorGasClassification);
//   changeStopsColor(stopClassificationColor);

//   // Simpan rentang saat ini untuk perbandingan berikutnya
//   lastGasRange = currentRange;

//   // return gasClasification;
// };

// export const updateBuzzerStatus = (topic, data) => {
//   const buzzerStatusElement = document.querySelector('connected-status');
  
//   if (!buzzerStatusElement) {
//     console.error('Buzzer status element not found');
//     return;
//   }

//   const buzzerImageElement = document.querySelector('.buzzer-image');
//   const backgroundBuzzerRing = document.querySelector('.connectedStatus__buzzer div');
  
//   if (!buzzerImageElement || !backgroundBuzzerRing) {
//     console.error('Buzzer elements not found');
//     return;
//   }

//   // Cek kondisi trigger buzzer
//   const shouldActivateBuzzer = 
//     (topic === "iot/gas" && data >= 610) || 
//     (topic === "iot/flame" && data == 1);

//   if (shouldActivateBuzzer) {
//     // Aktifkan buzzer
//     buzzerStatusElement.setAttribute('buzzer-text', 'Buzzer aktif');
//     buzzerImageElement.style.animation = "buzzerRing .25s ease-in-out infinite";
//     backgroundBuzzerRing.style.animation = "blinkBackgroundBuzzerRing .25s ease-in-out infinite";
//   } else {
//     // Matikan buzzer
//     buzzerStatusElement.setAttribute('buzzer-text', 'Buzzer non-aktif');
//     buzzerImageElement.style.animation = "none";
//     backgroundBuzzerRing.style.animation = "none";
//   }
// } 

// export const catchMessageGasData = (
//   valueSensor,
//   gasStatus,
//   gasValue,
//   circle,
//   colorCircleProgress,
//   stops
// ) => {
//   // Hubungkan ke MQTT
//   let gasLPGValue = gasValue;
//   // Tangkap pesan MQTT dan ubah tampilan halaman
//   getMQTTData(function (topic, data) {
//     if (topic === "iot/gas") {
//       function updateCircleProgress(gasValue) {
//         const maxGasValue = 1000;
//         // Hitung persentase dari gasValue
//         const percentage = (gasValue / maxGasValue) * 100;

//         // Hitung stroke-dashoffset baru
//         const radius = 100; // Radius lingkaran
//         const circumference = 2 * Math.PI * radius; // Keliling lingkaran
//         const offset = circumference - (circumference * percentage) / 100;

//         console.log(circle)
//         // Update stroke-dashoffset
//         circle.style.strokeDashoffset = offset;
//         // Update teks gasValue
//         gasLPGValue.innerHTML = gasValue;
//         gasLPGValue.style.color = "#fff";
//       }
//       updateCircleProgress(data);
//       Home.updateGasStatus(data);
//       const checkStatusGas = data >= 610 ? "Terdeteksi" : "Aman";
//       updateBuzzerStatus("iot/gas",data)
  
//       gasStatus.innerHTML = checkStatusGas;
//       valueSensor.innerHTML = data;
//       checkGasClasification(
//         data,
//         colorCircleProgress,
//         stops
//       );
//     }
//   });
// };

// export const catchMessageFlameData = (
//   flameValue,
//   flameStatus,
//   lineProgressFlame,
//   lineProgressFlameLayer
// ) => {
//   // Tangkap pesan MQTT dan ubah tampilan halaman
//   getMQTTData(function (topic, data) {
//     if (topic === "iot/flame") {
//       flameValue.forEach((flameValueEl) => {
//         flameValueEl.innerHTML = data;
//       });
//       const checkStatusFlame = data == 1 ? "Terdeteksi" : "Aman";
//       if (data == 1) {
//         lineProgressFlame.classList.add("danger-flame");
//         lineProgressFlameLayer.classList.add("danger-flame-layer");
//         lineProgressFlame.classList.remove("safe-flame");
//         lineProgressFlameLayer.classList.remove("safe-flame-layer");
//         title = `Terdeteksi Api!`;
//         if (!notifTriggered.dangerFlame) {
//           triggerNotif(title, "Terdeteksi Api! Segera cek gas LPG kamu!");
//           showApiAlert()
//           notifTriggered.danger = true;
//         }
//         resetNotifFlags("careful"); // Reset notif rentang lain
//       } else {
//         lineProgressFlame.classList.remove("danger-flame");
//         lineProgressFlameLayer.classList.remove("danger-flame-layer");
//         lineProgressFlame.classList.add("safe-flame");
//         lineProgressFlameLayer.classList.add("safe-flame-layer");
//         resetNotifFlags("safeFlame");
//       }
//       flameStatus.innerHTML = checkStatusFlame;
//       updateBuzzerStatus("iot/flame", data)
//     }
//   });
// };

// async function triggerNotif(title, message) {
//   try {
//     const response = await fetch(`${CONFIG.BACKEND_URL}/trigger-notification`, {
//       method: "POST",
//       body: JSON.stringify({ title, message }),
//       headers: { "Content-Type": "application/json" },
//     });
  
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
  
//     console.log("Notification triggered successfully:", await response.json());
//   } catch (error) {
//     console.error("Error triggering notification:", error);
//   }
// }


// src/data/thesensordata-source.js
import { getMQTTData, removeMQTTCallback } from "../globals/mqtt-client";
import { SensorManager } from "../utils/sensorManager";
import Home from "../views/pages/home";
const sensorManager = new SensorManager();

let gasDataHandlerRegistered = false;
let flameDataHandlerRegistered = false;

export function cleanupHandlers() {
  try {
    removeMQTTCallback("iot/gas");
    removeMQTTCallback("iot/flame");
    gasDataHandlerRegistered = false;
    flameDataHandlerRegistered = false;
    console.log("All handlers cleaned up successfully");
  } catch (error) {
    console.error("Error cleaning up handlers:", error);
  }
}

export function setupGasDataHandlers(elements) {
  if (gasDataHandlerRegistered) {
    return; // Hindari pendaftaran ganda
  }
  
  getMQTTData("iot/gas", (topic, data) => {
    handleGasData(data, elements);
  });
  
  gasDataHandlerRegistered = true;
}

function handleGasData(data, elements) {
  updateCircleProgress(elements.circle, elements.gasValue, data);
  Home.updateGasStatus(data);
  
  const status = data >= 610 ? "Terdeteksi" : "Aman";
  elements.gasStatus.textContent = status;
  elements.valueSensor.textContent = data;
  
  sensorManager.checkGasClassification(data, elements.colorCircleProgress, elements.stops);
  sensorManager.updateBuzzerStatus("iot/gas", data);
}

// function updateCircleProgress(circle, valueElement, gasValue) {
//   const max = 1000;
//   const percentage = Math.min(gasValue / max * 100, 100);
//   const radius = 100;
//   const circumference = 2 * Math.PI * radius;
//   const offset = circumference - (circumference * percentage) / 100;

//   circle.style.strokeDashoffset = offset;
//   valueElement.textContent = gasValue;
//   valueElement.style.color = "#fff";
// }

function updateCircleProgress(circle, valueElement, gasValue) {
  // Add null checks for all parameters
  if (!circle || !valueElement || gasValue === undefined || gasValue === null) {
    console.error('Invalid parameters to updateCircleProgress:', {circle, valueElement, gasValue});
    return;
  }

  try {
    const max = 1000;
    const percentage = Math.min(gasValue / max * 100, 100);
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (circumference * percentage) / 100;

    // Verify circle exists before setting properties
    if (circle.style) {
      circle.style.strokeDashoffset = offset;
    } else {
      console.error('Circle element has no style property:', circle);
    }

    // Safely update value display
    if (valueElement.textContent !== undefined) {
      valueElement.textContent = gasValue;
      valueElement.style.color = "#fff";
    }
  } catch (error) {
    console.error('Error in updateCircleProgress:', error);
  }
}

export function setupFlameDataHandlers(elements) {
  if (flameDataHandlerRegistered) {
    return;
  }
  
  getMQTTData("iot/flame", (topic, data) => {
    handleFlameData(data, elements);
  });
  
  flameDataHandlerRegistered = true;
}

// Enhanced handleFlameData with error checking
function handleFlameData(data, elements) {
  try {
    if (!elements || !elements.flameValue) {
      throw new Error('Missing required flame elements');
    }
    
    const numericData = parseInt(data);
    if (isNaN(numericData)) {
      throw new Error(`Invalid flame data: ${data}`);
    }
    
    sensorManager.updateMultipleValues(elements.flameValue, numericData);
    sensorManager.handleFlameData(numericData, elements);
    console.log("sukses")
  } catch (error) {
    console.error('Flame data processing error:', error);
    // Optionally display error to user
  }
}
import { CONFIG } from "../globals/config";
import { showApiAlert, showGasAlert } from "../utils/alertManager";

export class SensorManager {
  constructor() {
    // Track which gas range we're currently in
    this.currentGasRange = "safe"; // Initially we assume gas is safe
    
    // Track flame detection state
    this.flameDetected = false;
    
    this.lastGasValue = 0;
  }

  checkGasClassification(data, colorCircleProgress, stops) {
    if (!colorCircleProgress || !stops) {
      console.error("Invalid parameters to checkGasClassification");
      return null;
    }
  
    const classification = this.determineGasClassification(data);
    if (!classification) return null;
  
    this.updateVisuals(classification, colorCircleProgress, stops);
  
    // Only notify if we moved to a different gas range
    if (this.currentGasRange !== classification.currentRange) {
      this.handleNotifications(classification, data);
      // Update the current range AFTER sending notification
      this.currentGasRange = classification.currentRange;
    }
  
    return classification;
  }
  
  determineGasClassification(data) {
    let classification = {
      gasClassification: "Aman",
      colorClassification: "safe-gas",
      stopColor: "green",
      currentRange: "safe",
      message: "",
    };

    if (data >= 200 && data < 500) {
      classification = this.getCarefulClassification(data);
    } else if (data >= 500 && data < 2000) {
      classification = this.getAlertClassification(data);
    } else if (data >= 2000) {
      classification = this.getDangerClassification(data);
    }

    return classification;
  }

  getCarefulClassification(data) {
    return {
      gasClassification: "Hati-hati",
      colorClassification: "careful-gas",
      stopColor: "yellow",
      currentRange: "careful",
      message: "Kadar gas melebihi 200 PPM, Segera cek sumber gas untuk pencegahan dini!",
      title: `Terdeteksi Gas! (Hati-hati)`,
    };
  }

  getAlertClassification(data) {
    return {
      gasClassification: "Waspada",
      colorClassification: "alert-gas",
      stopColor: "orange",
      currentRange: "alert",
      message: "Kadar gas melebihi 500 PPM, Segera cek sumber gas, matikan api, dan buka ventilasi!",
      title: `Terdeteksi Gas! (Waspada)`
    };
  }

  getDangerClassification(data) {
    return {
      gasClassification: "Bahaya",
      colorClassification: "danger-gas",
      stopColor: "red",
      currentRange: "danger",
      message: "Kadar gas melebihi 2000 PPM, Segera keluarkan gas LPG kamu ke ruangan terbuka, jangan menyalakan api dan matikan listrik!",
      title: `Terdeteksi Gas! (Bahaya)`
    };
  }
  
  updateVisuals(classification, colorCircleProgress, stops) {
    colorCircleProgress.forEach((el) => {
      el.className = classification.colorClassification;
    });
    stops.forEach((stop) => {
      stop.style.stopColor = classification.stopColor;
    });
  }

  handleNotifications(classification, data) {
    if (classification.message && classification.title) {
      this.triggerNotif(classification.title, classification.message);
      showGasAlert(classification.message);
    }
  }
  
  // Flame handling
  handleFlameData(data, elements) {
    const isFlameDetected = data == 1;
    const status = isFlameDetected ? "Terdeteksi" : "Aman";
    elements.flameStatus.textContent = status;

    this.updateFlameVisuals(
      isFlameDetected,
      elements.lineProgressFlame,
      elements.lineProgressFlameLayer
    );
    
    // Only send notifications when flame state changes
    if (this.flameDetected !== isFlameDetected) {
      this.handleFlameNotifications(isFlameDetected);
      this.flameDetected = isFlameDetected;
    }
    
    this.updateBuzzerStatus("iot/flame", isFlameDetected);
  }

  updateFlameVisuals(isFlameDetected, lineProgress, lineProgressLayer) {
    if (isFlameDetected) {
      lineProgress.classList.add("danger-flame");
      lineProgress.classList.remove("safe-flame");
      lineProgressLayer.classList.add("danger-flame-layer");
      lineProgressLayer.classList.remove("safe-flame-layer");
    } else {
      lineProgress.classList.remove("danger-flame");
      lineProgress.classList.add("safe-flame");
      lineProgressLayer.classList.remove("danger-flame-layer");
      lineProgressLayer.classList.add("safe-flame-layer");
    }
  }

  handleFlameNotifications(isFlameDetected) {
    if (isFlameDetected) {
      const title = "Terdeteksi Api!";
      const message = "Terdeteksi Api! segera periksa sumber gas LPG!";
      this.triggerNotif(title, message);
      showApiAlert();
    }
  }

  async triggerNotif(title, message) {
    try {
      const response = await fetch(
        `${CONFIG.BACKEND_URL}/trigger-notification`,
        {
          method: "POST",
          body: JSON.stringify({ title, message }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error("Error triggering notification:", error);
    }
  }

  updateBuzzerStatus(topic, data) {
    const buzzerElement = document.querySelector("connected-status");
    const buzzerImage = document.querySelector(".buzzer-image");
    const buzzerRing = document.querySelector(".connectedStatus__buzzer div");

    if (!buzzerElement || !buzzerImage || !buzzerRing) return;

    const isActive =
      (topic === "iot/gas" && data >= 200) ||
      (topic === "iot/flame" && data == 1);

    buzzerElement.setAttribute(
      "buzzer-text",
      `Buzzer ${isActive ? "aktif" : "non-aktif"}`
    );
    buzzerImage.style.animation = isActive
      ? "buzzerRing .25s ease-in-out infinite"
      : "none";
    buzzerRing.style.animation = isActive
      ? "blinkBackgroundBuzzerRing .25s ease-in-out infinite"
      : "none";
  }

  updateMultipleValues(elements, value) {
    elements.forEach((el) => {
      el.textContent = value;
    });
  }

  setupMQTTSubscriptions(topics, callbackMap) {
    getMQTTData((topic, data) => {
      if (callbackMap[topic]) {
        callbackMap[topic](data);
      }
    });
  }
}
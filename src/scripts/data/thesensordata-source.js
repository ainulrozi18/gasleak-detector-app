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
  } catch (error) {
    console.error("Error cleaning up handlers:", error);
  }
}

export function setupGasDataHandlers(elements) {
  if (gasDataHandlerRegistered) {
    return;
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

  sensorManager.checkGasClassification(
    data,
    elements.colorCircleProgress,
    elements.stops
  );
  sensorManager.updateBuzzerStatus("iot/gas", data);
}

function updateCircleProgress(circle, valueElement, gasValue) {
  if (!circle || !valueElement || gasValue === undefined || gasValue === null) {
    console.error("Invalid parameters to updateCircleProgress:", {
      circle,
      valueElement,
      gasValue,
    });
    return;
  }

  try {
    const max = 1000;
    const percentage = Math.min((gasValue / max) * 100, 100);
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (circumference * percentage) / 100;

    if (circle.style) {
      circle.style.strokeDashoffset = offset;
    } else {
      console.error("Circle element has no style property:", circle);
    }

    if (valueElement.textContent !== undefined) {
      valueElement.textContent = gasValue;
      valueElement.style.color = "#fff";
    }
  } catch (error) {
    console.error("Error in updateCircleProgress:", error);
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

function handleFlameData(data, elements) {
  try {
    if (!elements || !elements.flameValue) {
      throw new Error("Missing required flame elements");
    }

    const numericData = parseInt(data);
    if (isNaN(numericData)) {
      throw new Error(`Invalid flame data: ${data}`);
    }

    sensorManager.updateMultipleValues(elements.flameValue, numericData);
    sensorManager.handleFlameData(numericData, elements);
  } catch (error) {
    console.error("Flame data processing error:", error);
  }
}

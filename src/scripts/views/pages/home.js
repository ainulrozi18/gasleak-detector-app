import { setupGasDataHandlers, setupFlameDataHandlers, cleanupHandlers } from "../../data/thesensordata-source";

const Home = {
  async render() {
    return `
    <div class="home">
        <div class="skill">
        <div id="outer">
          <div class="inner">
            <div id="value">
            <p id="gasValue">0</p>
            <p>PPM</p>
            </div>
          </div>
        </div>

          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="250px" height="250px">
          <defs>
            <linearGradient id="GradientColor">
              <stop id="stop1" offset="0%" stop-color="rgb(38, 198, 38)" />
              <stop id="stop2" offset="100%" stop-color="green" />
            </linearGradient>
          </defs>
          <circle cx="125" cy="125" r="100" stroke-linecap="round" transform="rotate(-90 125 125)"/>
          </svg>
      </div>

      <div class="line-progress-flame safe-flame">
        <div class="line-progress-flame__layer safe-flame-layer"></div>
        <p class="text-flame-value flameValue">0</p>
      </div>

      <div class="statusSensor">
        <p id="gasValue" class="statusSensor__gas">Status Gas : <span id="gasStatus">Aman</span> (<span id="gasValueSensor">0</span>)</p>
        <p class="statusSensor__flame">Status Api : <span id="flameStatus">Aman</span> (<span class="flameValue">0</span>)</p>
      </div>

      <div class="statusCategory">
        <div class="statusCategory__circle safe">
          <div class="statusValue safe">
            <p class="statusValue__text">Aman</p>
          </div>
        </div>
        <div class="statusCategory__circle careful">
          <div class="statusValue careful">
            <p class="statusValue__text">Hati-hati</p>
          </div>
        </div>
        <div class="statusCategory__circle alert">
          <div class="statusValue alert">
            <p class="statusValue__text">Waspada</p>
          </div>
        </div>
        <div class="statusCategory__circle danger">
          <div class="statusValue danger">
            <p class="statusValue__text">Bahaya</p>
          </div>
        </div>
      </div>
    </div>  
    `;
  },

  async afterRender() {
    this.updateGasStatus();
  },

  updateGasStatus(sensorValue) {
    // Constants for DOM elements
    let sensorValueOfGas = sensorValue;
    const GAS_ELEMENTS = {
      value: document.getElementById("gasValue"),
      circle: document.querySelector("circle"),
      stops: {
        stop1: document.querySelector("#stop1"),
        stop2: document.querySelector("#stop2"),
      },
      valueSensor: document.querySelector("#gasValueSensor"),
      status: document.querySelector("#gasStatus"),
      colors: {
        outer: document.querySelector("#outer"),
        value: document.querySelector("#value"),
      },
    };

    const FLAME_ELEMENTS = {
      values: document.querySelectorAll(".flameValue"),
      status: document.querySelector("#flameStatus"),
      lineProgress: document.querySelector(".line-progress-flame"),
      lineProgressLayer: document.querySelector(".line-progress-flame__layer"),
    };

let monitoringInitialized = false;

function initializeMonitoring() {
  // Hanya inisialisasi sekali
  if (monitoringInitialized) {
    console.log("Monitoring already initialized");
    return;
  }

  // Bersihkan handler sebelumnya (jika ada)
  try {
    if (typeof cleanupHandlers === 'function') {
      cleanupHandlers();
    }
  } catch (error) {
    console.error("Cleanup error:", error);
  }

  // Setup handler baru
  try {
    setupGasDataHandlers({
      valueSensor: GAS_ELEMENTS.valueSensor,
      gasStatus: GAS_ELEMENTS.status,
      gasValue: GAS_ELEMENTS.value,
      circle: GAS_ELEMENTS.circle,
      colorCircleProgress: [GAS_ELEMENTS.colors.outer, GAS_ELEMENTS.colors.value],
      stops: [GAS_ELEMENTS.stops.stop1, GAS_ELEMENTS.stops.stop2]
    });

    setupFlameDataHandlers({
      flameValue: FLAME_ELEMENTS.values,
      flameStatus: FLAME_ELEMENTS.status,
      lineProgressFlame: FLAME_ELEMENTS.lineProgress,
      lineProgressFlameLayer: FLAME_ELEMENTS.lineProgressLayer
    });

    monitoringInitialized = true;
  } catch (error) {
    console.error("Initialization failed:", error);
  }
}

    // Update gas status styles based on sensor value
    function updateGasStatusStyle(sensorValueOfGas) {
      const STATUS_CATEGORIES = {
        safe: {
          threshold: 200,
          borderColor: "green",
          backgroundColor: "green",
          borderAnimation: "blinkBorderGreen 1.5s ease-in-out infinite",
          backgroundAnimation: "blinkGreen 1.5s ease-in-out infinite",
        },
        careful: {
          threshold: 500,
          borderColor: "yellow",
          backgroundColor: "yellow",
          borderAnimation: "blinkBorderYellow 1.2s ease-in-out infinite",
          backgroundAnimation: "blinkYellow 1.2s ease-in-out infinite",
        },
        alert: {
          threshold: 2000,
          borderColor: "orange",
          backgroundColor: "orange",
          borderAnimation: "blinkBorderOrange .8s ease-in-out infinite",
          backgroundAnimation: "blinkOrange .8s ease-in-out infinite",
        },
        danger: {
          threshold: Infinity,
          borderColor: "red",
          backgroundColor: "red",
          borderAnimation: "blinkBorderRed .5s ease-in-out infinite",
          backgroundAnimation: "blinkRed .5s ease-in-out infinite",
        },
      };

      // Reset all status indicators
      document.querySelectorAll(".statusCategory__circle").forEach((circle) => {
        circle.style.borderColor = "grey";
        circle.style.animation = "none";
      });

      document.querySelectorAll(".statusValue").forEach((circle) => {
        circle.style.backgroundColor = "grey";
        circle.style.animation = "none";
      });

      // Determine which status to apply
      let activeStatus = null;
      for (const [status, config] of Object.entries(STATUS_CATEGORIES)) {
        if (sensorValueOfGas < config.threshold) {
          activeStatus = status;
          break;
        }
      }

      if (activeStatus) {
        const config = STATUS_CATEGORIES[activeStatus];
        const borderElement = document.querySelector(`.${activeStatus}`);
        const backgroundElement = document.querySelector(
          `.statusCategory__circle .${activeStatus}`
        );

        if (borderElement && backgroundElement) {
          borderElement.style.borderColor = config.borderColor;
          borderElement.style.animation = config.borderAnimation;
          backgroundElement.style.backgroundColor = config.backgroundColor;
          backgroundElement.style.animation = config.backgroundAnimation;
        }
      }
    }
    initializeMonitoring()
    updateGasStatusStyle(sensorValueOfGas)
  },
};

export default Home;

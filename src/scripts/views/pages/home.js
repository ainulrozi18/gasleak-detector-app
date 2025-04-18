import {
  catchMessageFlameData,
  catchMessageGasData,
} from "../../data/thesensordata-source";

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
        <p class="text-flame-value flameValue">...</p>
      </div>

      <div class="statusSensor">
        <p id="gasValue" class="statusSensor__gas">Status Gas : <span id="gasStatus">...</span> (<span id="gasValueSensor">...</span>)</p>
        <p class="statusSensor__flame">Status Api : <span id="flameStatus">...</span> (<span class="flameValue">...</span>)</p>
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
    //   const gasValue = document.getElementById('gasValue');
    //   const circle = document.querySelector('circle');
    //   const stop1 = document.querySelector('#stop1')
    //   const stop2 = document.querySelector('#stop2')
    //   const gasClasification = document.querySelector('#gasClasification');
    //   const gasStatus = document.querySelector('#gasStatus');
    //   const outerColor = document.querySelector('#outer');
    //   const valueColor = document.querySelector('#value');
    //   const stops = [stop1, stop2]
    //   const colorCircleProgress = [outerColor, valueColor];

    //   const flameValue = document.querySelectorAll('.flameValue');
    //   const flameStatus = document.querySelector('#flameStatus');
    //   const lineProgressFlame = document.querySelector('.line-progress-flame');
    //   const lineProgressFlameLayer = document.querySelector('.line-progress-flame__layer');

    //   const flameParams = [flameValue, flameStatus, lineProgressFlame, lineProgressFlameLayer]
    //   const gasParams = [gasClasification, gasStatus, gasValue, circle, colorCircleProgress, stops]

    //   catchMessageFlameData(...flameParams);
    //   catchMessageGasData(...gasParams);
    // },

    // updateGasStatusStyle(sensorValue) {
    //   const borderCirclesGasStatus = document.querySelectorAll('.statusCategory__circle');
    //   borderCirclesGasStatus.forEach(borderCircle => {
    //     borderCircle.style.borderColor = 'grey';
    //     borderCircle.style.animation = 'none';
    //   });

    //   const backgroundCircleGasStatus = document.querySelectorAll('.statusValue');
    //   backgroundCircleGasStatus.forEach(backgroundCircle => {
    //     backgroundCircle.style.backgroundColor = 'grey'
    //     backgroundCircle.style.animation = 'none';
    //   })

    //   if (sensorValue < 610) {
    //     const safeElement = document.querySelector('.safe');
    //     const safeElementBackground = document.querySelector('.statusCategory__circle .safe');
    //     safeElement.style.borderColor = 'green';
    //     safeElementBackground.style.backgroundColor = 'green';
    //     safeElement.style.animation = 'blinkBorderGreen 1.5s ease-in-out infinite';
    //     safeElementBackground.style.animation = 'blinkGreen 1.5s ease-in-out infinite';
    //   } else if (sensorValue >= 610 && sensorValue < 800) {
    //     const carefulElement = document.querySelector('.careful');
    //     const carefulElementBackground = document.querySelector('.statusCategory__circle .careful');
    //     carefulElement.style.borderColor = 'yellow';
    //     carefulElementBackground.style.backgroundColor = 'yellow';
    //     carefulElement.style.animation = 'blinkBorderYellow 1.2s ease-in-out infinite';
    //     carefulElementBackground.style.animation = 'blinkYellow 1.2s ease-in-out infinite';
    //   } else if (sensorValue >= 800 && sensorValue < 1000) {
    //     const alertElement = document.querySelector('.alert');
    //     const alertElementBackground = document.querySelector('.statusCategory__circle .alert');
    //     alertElement.style.borderColor = 'orange';
    //     alertElementBackground.style.backgroundColor = 'orange';
    //     alertElement.style.animation = 'blinkBorderOrange .8s ease-in-out infinite';
    //     alertElementBackground.style.animation = 'blinkOrange .8s ease-in-out infinite';
    //   } else if (sensorValue >= 1000) {
    //     const dangerElement = document.querySelector('.danger');
    //     const dangerElementBackground = document.querySelector('.statusCategory__circle .danger');
    //     dangerElement.style.borderColor = 'red';
    //     dangerElementBackground.style.backgroundColor = 'red';
    //     dangerElement.style.animation = 'blinkBorderRed .5s ease-in-out infinite';
    //     dangerElementBackground.style.animation = 'blinkRed .5s ease-in-out infinite';
    //   }
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

    // Initialize gas and flame monitoring
    function initializeMonitoring() {
      catchMessageFlameData(
        FLAME_ELEMENTS.values,
        FLAME_ELEMENTS.status,
        FLAME_ELEMENTS.lineProgress,
        FLAME_ELEMENTS.lineProgressLayer
      );

      catchMessageGasData(
        GAS_ELEMENTS.valueSensor,
        GAS_ELEMENTS.status,
        GAS_ELEMENTS.value,
        GAS_ELEMENTS.circle,
        [GAS_ELEMENTS.colors.outer, GAS_ELEMENTS.colors.value],
        [GAS_ELEMENTS.stops.stop1, GAS_ELEMENTS.stops.stop2]
      );
    }

    // Update gas status styles based on sensor value
    function updateGasStatusStyle(sensorValueOfGas) {
      const STATUS_CATEGORIES = {
        safe: {
          threshold: 610,
          borderColor: "green",
          backgroundColor: "green",
          borderAnimation: "blinkBorderGreen 1.5s ease-in-out infinite",
          backgroundAnimation: "blinkGreen 1.5s ease-in-out infinite",
        },
        careful: {
          threshold: 800,
          borderColor: "yellow",
          backgroundColor: "yellow",
          borderAnimation: "blinkBorderYellow 1.2s ease-in-out infinite",
          backgroundAnimation: "blinkYellow 1.2s ease-in-out infinite",
        },
        alert: {
          threshold: 1000,
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

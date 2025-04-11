import { catchMessageFlameData, catchMessageGasData } from "../../data/thesensordata-source";

const Home = {
  async render() {
    return `
    <connected-status status="" buzzer-text="Buzzer non-aktif"></connected-status>
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
        <p id="gasValue" class="statusSensor__gas">Status Gas : <span id="gasStatus">...</span> (<span id="gasClasification">...</span>)</p>
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
      
    `;
  },

  async afterRender() {
    const gasValue = document.getElementById('gasValue');
    const circle = document.querySelector('circle');
    const stop1 = document.querySelector('#stop1')
    const stop2 = document.querySelector('#stop2')
    const gasClasification = document.querySelector('#gasClasification');
    const gasStatus = document.querySelector('#gasStatus');
    const outerColor = document.querySelector('#outer');
    const valueColor = document.querySelector('#value');
    const stops = [stop1, stop2]
    const colorCircleProgress = [outerColor, valueColor];

    const flameValue = document.querySelectorAll('.flameValue');
    const flameStatus = document.querySelector('#flameStatus');
    const lineProgressFlame = document.querySelector('.line-progress-flame');
    const lineProgressFlameLayer = document.querySelector('.line-progress-flame__layer');

    const flameParams = [flameValue, flameStatus, lineProgressFlame, lineProgressFlameLayer]
    const gasParams = [gasClasification, gasStatus, gasValue, circle, colorCircleProgress, stops]

    catchMessageFlameData(...flameParams);
    catchMessageGasData(...gasParams);
  },

  updateGasStatusStyle(sensorValue) {
    const borderCirclesGasStatus = document.querySelectorAll('.statusCategory__circle');
    borderCirclesGasStatus.forEach(borderCircle => {
      borderCircle.style.borderColor = 'grey';
    });

    const backgroundCircleGasStatus = document.querySelectorAll('.statusValue');
    backgroundCircleGasStatus.forEach(backgroundCircle => {
      backgroundCircle.style.backgroundColor = 'grey'
      backgroundCircle.style.animation = 'none';
    })

    if (sensorValue < 610) {
      const safeElement = document.querySelector('.safe');
      const safeElementBackground = document.querySelector('.statusCategory__circle .safe');
      safeElement.style.borderColor = 'green';
      safeElementBackground.style.backgroundColor = 'green';
      safeElement.style.animation = 'blinkBorderGreen 1.5s ease-in-out infinite';
      safeElementBackground.style.animation = 'blinkGreen 1.5s ease-in-out infinite';
    } else if (sensorValue >= 610 && sensorValue < 800) {
      const carefulElement = document.querySelector('.careful');
      const carefulElementBackground = document.querySelector('.statusCategory__circle .careful');
      carefulElement.style.borderColor = 'yellow';
      carefulElementBackground.style.backgroundColor = 'yellow';
      carefulElement.style.animation = 'blinkBorderYellow 1.2s ease-in-out infinite';
      carefulElementBackground.style.animation = 'blinkYellow 1.2s ease-in-out infinite';
    } else if (sensorValue >= 800 && sensorValue < 1000) {
      const alertElement = document.querySelector('.alert');
      const alertElementBackground = document.querySelector('.statusCategory__circle .alert');
      alertElement.style.borderColor = 'orange';
      alertElementBackground.style.backgroundColor = 'orange';
      alertElement.style.animation = 'blinkBorderOrange .8s ease-in-out infinite';
      alertElementBackground.style.animation = 'blinkOrange .8s ease-in-out infinite';
    } else if (sensorValue >= 1000) {
      const dangerElement = document.querySelector('.danger');
      const dangerElementBackground = document.querySelector('.statusCategory__circle .danger');
      dangerElement.style.borderColor = 'red';
      dangerElementBackground.style.backgroundColor = 'red';
      dangerElement.style.animation = 'blinkBorderRed .5s ease-in-out infinite';
      dangerElementBackground.style.animation = 'blinkRed .5s ease-in-out infinite';
    }
  }
};

export default Home;
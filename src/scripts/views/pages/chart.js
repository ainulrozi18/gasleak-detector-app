import Chart from "chart.js/auto";
import { getMQTTData } from "../../globals/mqtt-client";
import { SensorManager } from "../../utils/sensorManager";

const ChartJS = {
  gasChart: null,
  flameChart: null,
  gasData: { labels: [], values: [] },
  flameData: { labels: [], values: [] },

  async render() {
    return `
      <div class="chart">
        <div class="chart__gas">
          <canvas id="myChart__gas" height="300"></canvas>
        </div>
        <div class="chart__flame">
          <canvas id="myChart__flame" height="300"></canvas>
        </div>
      </div>
    `;
  },

  async afterRender() {
    await this.initCharts();
    this.subscribeToMQTT();
  },

  async initCharts() {
    try {
      // Pastikan canvas elements ada sebelum membuat chart
      await this.waitForElements();
      
      // Inisialisasi grafik gas
      const gasCtx = document.getElementById('myChart__gas').getContext('2d');
      this.gasChart = this.createChart(gasCtx, 'gas', 'Grafik kadar gas LPG', 'rgba(75, 192, 192, 1)');
      
      // Inisialisasi grafik flame
      const flameCtx = document.getElementById('myChart__flame').getContext('2d');
      this.flameChart = this.createChart(flameCtx, 'flame', 'Grafik deteksi kebakaran', 'rgba(255, 99, 132, 1)', {
        max: 1,
        callback: value => value === 1 ? 'DETECTED' : 'SAFE'
      });
      
      console.log('Charts initialized successfully');
    } catch (error) {
      console.error('Error initializing charts:', error);
    }
  },

  waitForElements() {
    return new Promise((resolve) => {
      const checkElements = () => {
        const gasCanvas = document.getElementById('myChart__gas');
        const flameCanvas = document.getElementById('myChart__flame');
        
        if (gasCanvas && flameCanvas) {
          resolve();
        } else {
          setTimeout(checkElements, 100);
        }
      };
      checkElements();
    });
  },

  createChart(ctx, type, label, borderColor, yAxisOptions = {}) {
    return new Chart(ctx, {
      type: "line",
      data: {
        labels: this[`${type}Data`].labels,
        datasets: [{
          label,
          data: this[`${type}Data`].values,
          backgroundColor: borderColor.replace('1)', '0.2)'),
          borderColor,
          borderWidth: 3,
          tension: 0.1,
          fill: true
        }]
      },
      options: this.getChartOptions(yAxisOptions)
    });
  },

  getChartOptions(yAxisOptions) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { 
            font: { 
              size: 9, 
              weight: "bold" 
            } 
          }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0, 0, 0, 0.1)' },
          ...yAxisOptions,
          ticks: { 
            font: { 
              size: 10, 
              weight: "bold" 
            } 
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          align: "center",
          labels: { 
            font: { 
              size: 11, 
              weight: "bold",
              family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
            },
            padding: 20
          }
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false
        }
      }
    };
  },

  subscribeToMQTT() {
    const sensorManager = new SensorManager();
    
    const topics = ["iot/gas", "iot/flame"];
    
    topics.forEach((topic) => {
      getMQTTData(topic, (receivedTopic, message) => {
        const time = new Date().toLocaleTimeString("id-ID", { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit',
          hourCycle: "h23" 
        });
  
        const value = parseFloat(message);
  
        if (receivedTopic === "iot/gas") {
          this.updateChartData(this.gasChart, this.gasData, time, value);
        } else if (receivedTopic === "iot/flame") {
          this.updateChartData(this.flameChart, this.flameData, time, value);
        }
  
        sensorManager.updateBuzzerStatus(receivedTopic, value);
      });
    });
  },
  

  updateChartData(chart, dataset, label, value) {
    if (!chart || !dataset) return;
    
    // Tambahkan data baru
    dataset.labels.push(label);
    dataset.values.push(value);
    
    // Batasi jumlah data yang ditampilkan
    if (dataset.labels.length > 15) {
      dataset.labels.shift();
      dataset.values.shift();
    }
    
    // Update chart
    chart.update(); 
  }
};

export default ChartJS;
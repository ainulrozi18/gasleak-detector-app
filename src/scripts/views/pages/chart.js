// import Chart from "chart.js/auto";
// import { getMQTTData } from "../../globals/mqtt-client.js";
// import { updateBuzzerStatus } from "../../data/thesensordata-source.js";

// const ChartJS = {
//     async render() {
//         return `
//         <div class="chart">
//             <div class="chart__gas">
//                 <canvas id="myChart__gas"></canvas>
//             </div>
//             <div class="chart__flame">
//                 <canvas id="myChart__flame"></canvas>
//             </div>
//         </div>
//         `;
//     },

//     async afterRender() {
//         this.initCharts();
//         this.subscribeToMQTT();
//     },    

//     initCharts() {
//         const ctxGas = document.getElementById("myChart__gas");
//         const ctxFlame = document.getElementById("myChart__flame");

//         // Data awal untuk grafik
//         this.gasData = { labels: [], values: [] };
//         this.flameData = { labels: [], values: [] };

//         // Grafik Gas LPG
//         this.gasChart = new Chart(ctxGas, {
//             type: "line",
//             data: {
//                 labels: this.gasData.labels,
//                 datasets: [{
//                     label: "Grafik kadar gas LPG",
//                     data: this.gasData.values,
//                     backgroundColor: "rgba(75, 192, 192, 0.2)",
//                     borderColor: "rgba(75, 192, 192, 1)",
//                     borderWidth: 3,
//                 }],
//             },
//             options: {
//                 responsive: true,
//                 scales: {
//                     x: {
//                         ticks: { // Atur ukuran font untuk label di sumbu X
//                             font: {
//                                 size: 9, // Ukuran font
//                                 weight: "bold", // Ketebalan font
//                             },
//                         },
//                     },
//                     y: {
//                         beginAtZero: true,
//                         ticks: { // Atur ukuran font untuk label di sumbu Y
//                             font: {
//                                 size: 10,
//                                 weight: "bold",
//                             },
//                         },
//                     },
//                 },
//                 plugins: {
//                     legend: {
//                         align: "center", // Menempatkan label legenda di tengah
//                         labels: {
//                             font: {
//                                 size: 11,
//                                 weight: "bold",
//                             },
//                         },
//                     },
//                 },
//             },
//         });

//         // Grafik Api
//         this.flameChart = new Chart(ctxFlame, {
//             type: "line",
//             data: {
//                 labels: this.flameData.labels,
//                 datasets: [{
//                     label: "Grafik deteksi kebakaran",
//                     data: this.flameData.values,
//                     backgroundColor: "rgba(255, 99, 132, 0.2)",
//                     borderColor: "rgba(255, 99, 132, 1)",
//                     borderWidth: 3,
//                 }],
//             },
//             options: {
//                 responsive: true,
//                 scales: {
//                     x: {
//                         ticks: { // Atur ukuran font untuk label di sumbu X
//                             font: {
//                                 size: 9, // Ukuran font
//                                 weight: "bold", // Ketebalan font
//                             },
//                         },
//                     },
//                     y: {
//                         beginAtZero: true,
//                         max: 1, // Memberikan ruang tambahan di atas nilai maksimum
//                         ticks: { // Atur ukuran font untuk label di sumbu Y
//                             font: {
//                                 size: 10,
//                                 weight: "bold",
//                             },
//                             callback: function(value) {
//                                 if(value === 1) return Math.floor(value);
//                                 else return value;
//                             },
//                         },
//                     },
//                 },
//                 plugins: {
//                     legend: {
//                         align: "center", // Menempatkan label legenda di tengah
//                         labels: {
//                             font: {
//                                 size: 11,
//                                 weight: "bold",
//                             },
//                         },
//                     },
//                 },
//             },
//         });
//     },

//     subscribeToMQTT() {
//         getMQTTData((topic, data) => {
//             // Gunakan format waktu 24 jam
//             const time = new Date().toLocaleTimeString("id-ID", { hourCycle: "h23" });
    
//             if (topic === "iot/gas") {
//                 this.updateChart(this.gasChart, this.gasData, time, parseInt(data));
//                 updateBuzzerStatus("iot/gas", data)
//             } else if (topic === "iot/flame") {
//                 this.updateChart(this.flameChart, this.flameData, time, parseInt(data));
//                 updateBuzzerStatus("iot/flame", data)
//             }
//         });
//     },

//     updateChart(chart, dataset, label, value) {
//         if (dataset.labels.length >= 5) {
//             dataset.labels.shift();
//             dataset.values.shift();
//         }

//         dataset.labels.push(label);
//         dataset.values.push(value);

//         chart.update();
//     },
  
// };

// export default ChartJS;

// // src/views/pages/chart.js
// import Chart from "chart.js/auto";
// import { getMQTTData } from "../../globals/mqtt-client";
// import { SensorManager } from "../../utils/sensorManager";
// const ChartJS = {
//   gasData: { labels: [], values: [] },
//   flameData: { labels: [], values: [] },

//   async render() {
//     return `
//       <div class="chart">
//         <div class="chart__gas"><canvas id="myChart__gas"></canvas></div>
//         <div class="chart__flame"><canvas id="myChart__flame"></canvas></div>
//       </div>
//     `;
//   },

//   async afterRender() {
//     this.initCharts();
//     this.subscribeToMQTT();
//   },

//   initCharts() {
//     this.gasChart = this.createChart("myChart__gas", "Grafik kadar gas LPG", "rgba(75, 192, 192, 1)");
//     this.flameChart = this.createChart("myChart__flame", "Grafik deteksi kebakaran", "rgba(255, 99, 132, 1)", {
//       max: 1,
//       callback: value => value === 1 ? Math.floor(value) : value
//     });
//   },

//   createChart(canvasId, label, borderColor, yAxisOptions = {}) {
//     return new Chart(document.getElementById(canvasId), {
//       type: "line",
//       data: {
//         labels: this[`${canvasId.includes('gas') ? 'gas' : 'flame'}Data`].labels,
//         datasets: [{
//           label,
//           data: this[`${canvasId.includes('gas') ? 'gas' : 'flame'}Data`].values,
//           backgroundColor: borderColor.replace('1)', '0.2)'),
//           borderColor,
//           borderWidth: 3,
//         }]
//       },
//       options: this.getChartOptions(yAxisOptions)
//     });
//   },

//   getChartOptions(yAxisOptions) {
//     return {
//       responsive: true,
//       scales: {
//         x: { ticks: { font: { size: 9, weight: "bold" } } },
//         y: { 
//           beginAtZero: true,
//           ...yAxisOptions,
//           ticks: { font: { size: 10, weight: "bold" } }
//         }
//       },
//       plugins: {
//         legend: {
//           align: "center",
//           labels: { font: { size: 11, weight: "bold" } }
//         }
//       }
//     };
//   },

//   subscribeToMQTT() {
//     const sensorManager = new SensorManager()
//     getMQTTData((topic, data) => {
//       const time = new Date().toLocaleTimeString("id-ID", { hourCycle: "h23" });
//       const value = parseInt(data);
      
//       if (topic === "iot/gas") {
//         this.updateChart(this.gasChart, this.gasData, time, value);
//       } else if (topic === "iot/flame") {
//         this.updateChart(this.flameChart, this.flameData, time, value);
//       }
      
//       sensorManager.updateBuzzerStatus(topic, value);
//     });
//   },

//   updateChart(chart, dataset, label, value) {
//     if (dataset.labels.length >= 5) {
//       dataset.labels.shift();
//       dataset.values.shift();
//     }
//     dataset.labels.push(label);
//     dataset.values.push(value);
//     chart.update();
//   }
// };

// export default ChartJS;

// src/views/pages/chart.js
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
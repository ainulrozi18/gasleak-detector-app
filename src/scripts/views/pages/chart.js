import Chart from "chart.js/auto";
import { getMQTTData } from "../../globals/mqtt-client.js";

const ChartJS = {
    async render() {
        return `
        <div class="chart">
            <div class="chart__gas">
                <canvas id="myChart__gas"></canvas>
            </div>
            <div class="chart__flame">
                <canvas id="myChart__flame"></canvas>
            </div>
        </div>
        `;
    },

    async afterRender() {
        this.initCharts();
        this.subscribeToMQTT();
    },    

    initCharts() {
        const ctxGas = document.getElementById("myChart__gas");
        const ctxFlame = document.getElementById("myChart__flame");

        // Data awal untuk grafik
        this.gasData = { labels: [], values: [] };
        this.flameData = { labels: [], values: [] };

        // Grafik Gas LPG
        this.gasChart = new Chart(ctxGas, {
            type: "line",
            data: {
                labels: this.gasData.labels,
                datasets: [{
                    label: "Grafik kadar gas LPG",
                    data: this.gasData.values,
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 3,
                }],
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        ticks: { // Atur ukuran font untuk label di sumbu X
                            font: {
                                size: 9, // Ukuran font
                                weight: "bold", // Ketebalan font
                            },
                        },
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { // Atur ukuran font untuk label di sumbu Y
                            font: {
                                size: 10,
                                weight: "bold",
                            },
                        },
                    },
                },
                plugins: {
                    legend: {
                        align: "center", // Menempatkan label legenda di tengah
                        labels: {
                            font: {
                                size: 11,
                                weight: "bold",
                            },
                        },
                    },
                },
            },
        });

        // Grafik Api
        this.flameChart = new Chart(ctxFlame, {
            type: "line",
            data: {
                labels: this.flameData.labels,
                datasets: [{
                    label: "Grafik deteksi kebakaran",
                    data: this.flameData.values,
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 3,
                }],
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        ticks: { // Atur ukuran font untuk label di sumbu X
                            font: {
                                size: 9, // Ukuran font
                                weight: "bold", // Ketebalan font
                            },
                        },
                    },
                    y: {
                        beginAtZero: true,
                        max: 1, // Memberikan ruang tambahan di atas nilai maksimum
                        ticks: { // Atur ukuran font untuk label di sumbu Y
                            font: {
                                size: 10,
                                weight: "bold",
                            },
                            callback: function(value) {
                                if(value === 1) return Math.floor(value);
                                else return value;
                            },
                        },
                    },
                },
                plugins: {
                    legend: {
                        align: "center", // Menempatkan label legenda di tengah
                        labels: {
                            font: {
                                size: 11,
                                weight: "bold",
                            },
                        },
                    },
                },
            },
        });
    },

    subscribeToMQTT() {
        getMQTTData((topic, data) => {
            // Gunakan format waktu 24 jam
            const time = new Date().toLocaleTimeString("id-ID", { hourCycle: "h23" });
    
            if (topic === "iot/gas") {
                this.updateChart(this.gasChart, this.gasData, time, parseInt(data));
            } else if (topic === "iot/flame") {
                this.updateChart(this.flameChart, this.flameData, time, parseInt(data));
            }
        });
    },

    updateChart(chart, dataset, label, value) {
        if (dataset.labels.length >= 5) {
            dataset.labels.shift();
            dataset.values.shift();
        }

        dataset.labels.push(label);
        dataset.values.push(value);

        chart.update();
    },
  
};

export default ChartJS;

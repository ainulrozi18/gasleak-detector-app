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
                    label: "Gas PPM",
                    data: this.gasData.values,
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                }],
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } },
            },
        });

        // Grafik Api
        this.flameChart = new Chart(ctxFlame, {
            type: "line",
            data: {
                labels: this.flameData.labels,
                datasets: [{
                    label: "Deteksi Api",
                    data: this.flameData.values,
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                }],
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true, max: 1 } },
            },
        });
    },

    subscribeToMQTT() {
        getMQTTData((topic, data) => {
            const time = new Date().toLocaleTimeString();

            if (topic === "iot/gas") {
                this.updateChart(this.gasChart, this.gasData, time, parseInt(data));
            } else if (topic === "iot/flame") {
                this.updateChart(this.flameChart, this.flameData, time, parseInt(data));
            }
        });
    },

    updateChart(chart, dataset, label, value) {
        if (dataset.labels.length >= 10) {
            dataset.labels.shift();
            dataset.values.shift();
        }

        dataset.labels.push(label);
        dataset.values.push(value);

        chart.update();
    },
};

export default ChartJS;

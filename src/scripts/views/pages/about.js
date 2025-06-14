import { CONFIG } from "../../globals/config";
import { getMQTTData } from "../../globals/mqtt-client";
import { showApiAlert, showGasAlert } from "../../utils/alertManager";

const About = {
  sentNotifications: new Set(),

  async render() {
    return `
    <div class="about">
        <h1 class="about__heading">Tentang Aplikasi</h1>
        <div class="cards">
            <div class="about__card">
                <div class="about__card-heading">
                    <h4>Tentang deteksi kadar gas LPG</h4>
                    <p>▼</p>
                </div>
                <div class="about__card-content">
                    <div class="content-section">
                        <div class="content-item">
                        <h5>Apa itu PPM?</h5>
                        <p>PPM (Part Per Million) adalah satuan konsentrasi yang menunjukkan jumlah bagian gas dalam satu juta bagian udara. 1 PPM berarti 1 bagian gas dalam 1 juta bagian udara.</p>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <div class="content-item">
                        <h5>Klasifikasi Status Gas LPG</h5>
                        <ul>
                            <li><span class="status-label aman">Aman</span>: Kurang dari 200 PPM (Konsentrasi normal, tidak berbahaya)</li>
                            <li><span class="status-label hati-hati">Hati-hati</span>: 200 PPM (Ambang batas awal kebocoran)</li>
                            <li><span class="status-label waspada">Waspada</span>: 500 PPM (Konsentrasi berbahaya, risiko ledakan rendah)</li>
                            <li><span class="status-label bahaya">Bahaya</span>: Lebih dari 2000 PPM (Risiko ledakan tinggi, sangat berbahaya)</li>
                        </ul>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <div class="content-item">
                        <h5>Cara Penanganan</h5>
                        <ul>
                            <li><span class="status-label aman">Aman</span>: Tidak diperlukan tindakan khusus</li>
                            <li><span class="status-label hati-hati">Hati-hati</span>: Periksa sumber gas untuk pencegahan dini</li>
                            <li><span class="status-label waspada">Waspada</span>: Periksa sumber gas, Matikan api, dan buka ventilasi ruangan</li>
                            <li><span class="status-label bahaya">Bahaya</span>: Segera keluarkan gas LPG ke ruangan terbuka, jangan menyalakan api, matikan listrik, dan hubungi petugas!</li>
                        </ul>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <div class="content-item">
                        <h5>Cara Kerja Sensor MQ-6</h5>
                        <p>Sensor MQ-6 mendeteksi gas LPG dengan prinsip perubahan resistansi material sensor ketika terpapar gas. Komponen utama sensor adalah bahan semikonduktor yang resistansinya menurun ketika berikatan dengan molekul gas LPG. Sensor ini memiliki sensitivitas tinggi terhadap LPG, propane, dan butane, dengan jangkauan deteksi 200-10,000 PPM.</p>
                        <p>Ketika gas terdeteksi, sensor mengubah konsentrasi gas menjadi sinyal listrik yang dapat dibaca oleh mikrokontroler.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="about__card">
                <div class="about__card-heading">
                <h4>Tentang deteksi api/kebakaran</h4>
                <p>▼</p>
                </div>
                <div class="about__card-content">
                    <div class="content-section">
                        <div class="content-item">
                        <h5>Cara Kerja Flame Sensor</h5>
                        <p>Flame Sensor bekerja dengan mendeteksi cahaya inframerah (760nm - 1100nm) yang dipancarkan oleh api. Sensor ini memiliki fotodioda yang peka terhadap spektrum cahaya api, dengan sudut deteksi sekitar 60°.</p>
                        <p>Jarak deteksi maksimal flame sensor adalah sekitar 1 meter dalam kondisi ideal (tanpa penghalang dan intensitas api sedang).</p>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <div class="content-item">
                        <h5>Interpretasi Nilai Sensor</h5>
                        <ul>
                            <li><span class="status-label">Nilai 0</span>: Tidak terdeteksi api (kondisi normal)</li>
                            <li><span class="status-label bahaya">Nilai 1</span>: Terdeteksi api (kondisi bahaya)</li>
                        </ul>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <div class="content-item">
                            <h5>Penanganan Kebakaran</h5>
                        <ol>
                            <li>Segera matikan sumber gas jika memungkinkan</li>
                            <li>Gunakan alat pemadam api ringan (APAR) jika api kecil</li>
                            <li>Evakuasi area jika api membesar</li>
                            <li>Hubungi petugas pemadam kebakaran</li>
                            <li>Jangan menggunakan air untuk memadamkan api gas</li>
                        </ol>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <div class="content-item">  
                            <h5>Pencegahan Kebakaran</h5>
                            <ul>
                            <li>Pastikan tabung gas dalam kondisi baik</li>
                            <li>Periksa regulator dan selang secara berkala</li>
                            <li>Jauhkan sumber api dari area penyimpanan gas</li>
                            <li>Pasang detektor kebocoran gas di area berisiko</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="about__card">
                <div class="about__card-heading">
                <h4>Teknologi yang dipakai</h4>
                <p>▼</p>
                </div>
                <div class="about__card-content">
                    <div class="content-section">
                        <h5>Perangkat Keras</h5>
                        <div class="tech-grid">
                            <div class="tech-item">
                                <img src="images/node-mcu.jpeg" alt="NodeMCU" class="tech-icon">
                                <div>
                                    <h6>NodeMCU ESP8266</h6>
                                    <p>Mikrokontroler WiFi dengan chip ESP8266, digunakan sebagai otak sistem yang mengintegrasikan semua sensor dan komponen.</p>
                                </div>
                            </div>
                            <div class="tech-item">
                                <img src="images/mq-6.jpeg" alt="MQ-6 Sensor" class="tech-icon">
                                <div>
                                    <h6>Sensor MQ-6</h6>
                                    <p>Sensor gas khusus untuk mendeteksi LPG dengan jangkauan 200-10,000 ppm. Memiliki sensitivitas tinggi terhadap propane dan butane.</p>
                                </div>
                            </div>
                            <div class="tech-item">
                                <img src="images/flame-sensor.jpg" alt="Flame Sensor" class="tech-icon">
                                <div>
                                    <h6>Flame Sensor KY-026</h6>
                                    <p>Mendeteksi api melalui spektrum inframerah (760-1100 nm) dengan sudut deteksi 60° dan jarak maksimal 1 meter.</p>
                                </div>
                            </div>
                            <div class="tech-item">
                                <img src="images/lcd.jpeg" alt="LCD" class="tech-icon">
                                <div>
                                    <h6>LCD 16x2</h6>
                                    <p>Display untuk menampilkan informasi real-time tentang status sistem dan pembacaan sensor.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <h5>Perangkat Lunak</h5>
                        <div class="tech-grid">
                            <div class="tech-item">
                                <img src="images/arduino-ide.png" alt="Arduino IDE" class="tech-icon">
                                <div>
                                    <h6>Arduino IDE</h6>
                                    <p>Lingkungan pengembangan untuk memprogram NodeMCU ESP8266 menggunakan bahasa C/C++.</p>
                                </div>
                            </div>
                            <div class="tech-item">
                                <img src="images/vscode.png" alt="Visual Studio Code IDE" class="tech-icon">
                                <div>
                                    <h6>Visual Studio Code</h6>
                                    <p>Suatu Aplikasi code editor untuk membantu proses pengembangan sebuah aplikasi maupun website.</p>
                                </div>
                            </div>
                            <div class="tech-item">
                                <img src="images/mqtt.png" alt="MQTT" class="tech-icon">
                                <div>
                                    <h6>Protokol MQTT</h6>
                                    <p>Protokol komunikasi ringan berbasis publish-subscribe untuk transfer data ke aplikasi web.</p>
                                </div>
                            </div>
                            <div class="tech-item">
                                <img src="images/web.png" alt="Web Tech" class="tech-icon">
                                <div>
                                    <h6>HTML, CSS, JavaScript</h6>
                                    <p>Teknologi web untuk membangun antarmuka aplikasi yang responsif dan interaktif.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <h5>Arsitektur Sistem</h5>
                        <div class="architecture">
                            <img src="/images/arsitektur.png" alt="System Architecture" class="architecture-img">
                            <p>Sistem terdiri dari tiga lapisan utama: Perangkat keras (sensor dan NodeMCU), Broker MQTT sebagai perantara komunikasi, dan Aplikasi Web sebagai antarmuka pengguna.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="about__card">
                <div class="about__card-heading">
                <h4>Tentang Developer</h4>
                <p>▼</p>
                </div>
                <div class="about__card-content">
                    <div class="developer-profile">
                        <img src="images/dev.jpg" alt="Developer" class="developer-avatar">
                        <div class="developer-info">
                            <h5>M Ainul Rozi S</h5>
                            <p class="developer-title">Mahasiswa Teknik Informatika</p>
                            <div class="developer-contact">
                                <a href="mailto:m.ainulrozi.s@gmail.com" class="contact-link">
                                    <img src="images/email.png" alt="Email"> m.ainulrozi.s@gmail.com
                                </a>
                                <a href="https://github.com/ainulrozi18" class="contact-link">
                                    <img src="images/github.png" alt="GitHub"> github.com/ainulrozi18
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
  },

  async afterRender() {
    // Toggle card
    document.querySelectorAll(".about__card").forEach((card) => {
      card.addEventListener("click", function () {
        const content = this.querySelector(".about__card-content");
        const icon = this.querySelector("p");

        content.classList.toggle("show");
        icon.textContent = content.classList.contains("show") ? "▲" : "▼";
      });
    });

    // Mulai langganan MQTT untuk notifikasi real-time
    this.subscribeToMQTT();
  },

  subscribeToMQTT() {
    const topics = ["iot/gas", "iot/flame"];

    topics.forEach((topic) => {
      getMQTTData(topic, async (receivedTopic, message) => {
        const value = parseFloat(message);

        if (receivedTopic === "iot/gas") {
          if (value >= 200 && value < 500) {
            await this.triggerNotif(
              "Terdeteksi Gas! (Hati-hati)",
              "Kadar gas melebihi 200 PPM, Segera cek sumber gas!"
            );
            showGasAlert("Kadar gas melebihi 200 PPM, Segera cek sumber gas untuk pencegahan dini!");
        } else if (value >= 500 && value < 2000) {
            await this.triggerNotif(
                "Terdeteksi Gas! (Waspada)",
                "Kadar gas melebihi 500 PPM, Matikan api dan buka ventilasi!"
            );
            showGasAlert("Kadar gas melebihi 500 PPM, Segera cek sumber gas, matikan api, dan buka ventilasi!");
        } else if (value >= 2000) {
            await this.triggerNotif(
                "Terdeteksi Gas! (Bahaya)",
                "Kadar gas melebihi 2000 PPM, Keluarkan tabung gas ke luar ruangan dan matikan listrik!"
            );
            showGasAlert("Kadar gas melebihi 2000 PPM, Segera keluarkan gas LPG kamu ke ruangan terbuka, jangan menyalakan api dan matikan listrik!");
          }
        }

        if (receivedTopic === "iot/flame" && value === 1) {
          await this.triggerNotif(
            "Terdeteksi Api!",
            "Terdeteksi api, segera periksa sumber gas LPG!"
          );
          showApiAlert();
        }
      });
    });
  },

  async triggerNotif(title, message) {
    const key = `${title}||${message}`;
    if (this.sentNotifications.has(key)) return;

    try {
      const response = await fetch(
        `${CONFIG.BACKEND_URL}/trigger-notification`,
        {
          method: "POST",
          body: JSON.stringify({ title, message }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        this.sentNotifications.add(key);
        console.log("✅ Notifikasi dikirim dari About:", key);
      } else {
        console.warn("❌ Gagal kirim notifikasi:", response.status);
      }
    } catch (error) {
      console.error("❌ Error triggering notification from About:", error);
    }
  },
};

export default About;

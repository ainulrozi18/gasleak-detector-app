const About = {
  async render(){
    return `
    <div class="about">
        <h1>Tentang Aplikasi</h1>
        <div class="cards">
            <div class="about__card">
                <div class="about__card-heading">
                    <h4>Tentang deteksi kadar gas LPG</h4>
                    <p>▼</p>
                </div>
                <div class="about__card-content show">
                    <h5>Klasifikasi status gas berdasarkan nilai PPM</h5>
                    <ul>
                        <li>Aman : </li><span>610 PPM </span>
                        <li>Hati-hati : </li><span>800 PPM</span>
                        <li>Waspada : </li><span>900 PPM</span>
                        <li>Bahaya : </li><span>1000++ PPM</span>
                    </ul>
                </div>
            </div>
            <div class="about__card">
                <div class="about__card-heading">
                <h4>Tentang deteksi api/kebakaran</h4>
                <p>▼</p>
                </div>
                <div class="about__card-content show" hidden></div>
            </div>
            <div class="about__card">
                <div class="about__card-heading">
                <h4>Teknologi yang dipakai</h4>
                <p>▼</p>
                </div>
                <div class="about__card-content show" hidden></div>
            </div>
            <div class="about__card">
                <div class="about__card-heading">
                <h4>Tentang Developer</h4>
                <p>▼</p>
                </div>
                <div class="about__card-content show" hidden></div>
            </div>
        </div>
    </div>
    `;
  },

  async afterRender() {
    document.querySelectorAll('.about__card').forEach((card) => {
      card.addEventListener('click', function () {
        const content = this.querySelector('.about__card-content');
        const icon = this.querySelector('p');

        // Close other cards
        document.querySelectorAll('.about__card-content').forEach((el) => {
          if (el !== content) {
            el.classList.remove('show');
            el.closest('.about__card').querySelector('p').textContent = '▼';
          }
        });

        // Toggle current card
        content.classList.toggle('show');
        icon.textContent = content.classList.contains('show') ? '▲' : '▼';
      });
    });
  }
};

export default About;
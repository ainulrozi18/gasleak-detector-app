class ConnectedStatus extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
  
    static get observedAttributes() {
      return ['status', 'buzzer-text']; // Daftarkan atribut yang akan diamati
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'status') {
        this.querySelector('#connectStatus').textContent = newValue;
      }
      if (name === 'buzzer-text') {
        this.querySelector('.connectedStatus__buzzer p').textContent = newValue;
      }
    }
  
    render() {
      this.innerHTML = `
        <div class="connectedStatus">
          <div class="connectedStatus__info">
            <img src="./wifi.png" alt="WiFi Icon" width="30">
            <h4 id="connectStatus">Menyambungkan</h4>
          </div>
          <div class="connectedStatus__buzzer">
            <img src="./notification.png" alt="Notification Icon" width="30">
            <p>Buzzer aktif</p>
          </div>
        </div>
      `;
    }
  }
  
  customElements.define('connected-status', ConnectedStatus);
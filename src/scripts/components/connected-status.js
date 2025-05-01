class ConnectedStatus extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
  
    static get observedAttributes() {
      return ['status', 'buzzer-text']; 
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'status') {
        this.querySelector('#connectStatus').textContent = newValue;
      }
      if (name === 'buzzer-text') {
        this.querySelector('#buzzerStatus').textContent = newValue;
      }
    }
  
    render() {
      this.innerHTML = `
        <div class="connectedStatus">
          <div class="connectedStatus__info">
            <img src="./images/wifi.png" alt="WiFi Icon" width="30">
            <h4 id="connectStatus"></h4>
          </div>
          <div class="connectedStatus__buzzer">
            <div>
              <img class="buzzer-image" src="./images/notification.png" alt="Buzzer Icon" width="30">
            </div>
            <h4 id="buzzerStatus"></h4>
          </div>
        </div>
      `;
    }
  }
  
  customElements.define('connected-status', ConnectedStatus);
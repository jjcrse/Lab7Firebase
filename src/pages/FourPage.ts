class FourPage extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setListeners();
  }

  private render() {
    this.shadow.innerHTML = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  :host {
    display: block;
    height: 100vh;
    background: linear-gradient(135deg, #000000 0%, #0a0a0a 100%);
    font-family: 'Share Tech Mono', monospace;
    color: #00ff88;
  }

  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem;
  }

  .glitch {
    font-size: 6rem;
    color: #00ff88;
    position: relative;

    text-shadow: 0 0 10px #00ff88, 0 0 20px #00ff88aa;
  }

  .glitch::before,
  .glitch::after {
    content: '404';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    overflow: hidden;
  }

  .glitch::before {
    color: #00ffaa;
    z-index: -1;
  }

  .glitch::after {
    color: #66ffcc;
    z-index: -1;
  }

  @keyframes glitchTop {
    0% { transform: translate(1px, -1px); }
    100% { transform: translate(-2px, 2px); }
  }

  @keyframes glitchBottom {
    0% { transform: translate(-1px, 1px); }
    100% { transform: translate(2px, -2px); }
  }

  @keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.85; }
  }

  .message {
    margin-top: 1rem;
    font-size: 1.4rem;
    color: #00ff88;
    text-shadow: 0 0 5px #00ff88aa;
  }

  .info {
    font-size: 1rem;
    color: #66ffbb;
    margin-bottom: 2rem;
  }

  button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    color: #000;
    background: #00ff88;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;
    box-shadow: 0 0 8px #00ff8855;
  }

  button:hover {
    background: #00ffaa;
    transform: scale(1.05);
  }
</style>

<div class="container">
  <div class="glitch">404</div>
  <div class="message">¡Ups! Página no encontrada</div>
  <div class="info">Parece que esta dirección no existe o fue eliminada. Intenta con otra 🧠</div>
  <button id="goHome">Ir al inicio</button>
</div>

    `;
  }

  private setListeners() {
    const btn = this.shadowRoot!.getElementById("goHome") as HTMLButtonElement;
    btn.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("route-change", {
        bubbles: true,
        composed: true,
        detail: { path: "/" }
      }));
    });
  }
}


export default FourPage;
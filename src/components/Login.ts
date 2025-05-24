import { loginUser } from "../services/firebase/auth-service";

class Login extends HTMLElement {
  private root: ShadowRoot;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  private render() {
    this.root.innerHTML = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #000;
    color: #00ff88;
    font-family: 'Share Tech Mono', monospace;
  }

  .form-box {
    width: 420px;
    padding: 2rem;
    background: #0a0a0a;
    border: 2px solid #00ff88;
    border-radius: 1rem;
    box-shadow: 0 0 20px #00ff8855;
    display: flex;
    flex-direction: column;
  }

  .form-box h1 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.7rem;
    color: #00ff88;
    text-shadow: 0 0 6px #00ff88;
  }

  input {
    width: 100%;
    padding: 0.8rem;
    background: #000;
    border: 1px solid #00ff88;
    color: #00ff88;
    border-radius: 0.4rem;
    font-size: 1rem;
    margin-bottom: 1.2rem;
    transition: border-color 0.25s, background-color 0.25s;
  }

  input:focus {
    outline: none;
    border-color: #00ffaa;
    background-color: #001e16;
    box-shadow: 0 0 5px #00ffaa88;
  }

  button {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    font-weight: bold;
    color: #000;
    background: #00ff88;
    border: none;
    border-radius: 0.4rem;
    cursor: pointer;
    transition: background 0.3s, transform 0.1s;
  }

  button:hover {
    background: #00dd77;
    transform: scale(1.02);
  }

  .error {
    margin-top: 1rem;
    text-align: center;
    color: #ff4455;
    font-size: 0.95rem;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

<div class="form-box">
  <h1>Login</h1>
  <input type="email" id="emailInput" placeholder="Correo electrónico" />
  <input type="password" id="passwordInput" placeholder="Contraseña" />
  <button id="accessBtn">Entrar</button>
  <div class="error" id="errorBox"></div>
</div>



    `;
  }

  private bindEvents() {
    const emailEl = this.root.getElementById("emailInput") as HTMLInputElement;
    const passEl = this.root.getElementById("passwordInput") as HTMLInputElement;
    const btn = this.root.getElementById("accessBtn") as HTMLButtonElement;
    const errorBox = this.root.getElementById("errorBox") as HTMLDivElement;

    btn.addEventListener("click", async () => {
      errorBox.textContent = "";
      const userEmail = emailEl.value.trim();
      const userPassword = passEl.value.trim();

      if (!userEmail || !userPassword) {
        errorBox.textContent = "Completa todos los campos.";
        return;
      }

      btn.disabled = true;
      btn.textContent = "Usala  un momento...";

      const result = await loginUser(userEmail, userPassword);

      if (result.success) {
        window.location.href = "/tasks";
      } else {
        const msg = (result.error as any)?.message
          || "Credenciales inválidas o error de conexión.";
        errorBox.textContent = msg;
        btn.disabled = false;
        btn.textContent = "Entrar";
      }
    });
  }
}

if (!customElements.get("the-login")) {
  customElements.define("the-login", Login);
}
export default Login;

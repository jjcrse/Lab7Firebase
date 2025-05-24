import { registerUser } from "../services/firebase/auth-service";

class Register extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEvents();
  }

  private render() {
    this.shadow.innerHTML = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #000;
    font-family: 'Share Tech Mono', monospace;
    color: #00ff88;
  }

  .form-wrapper {
    width: 420px;
    padding: 2rem;
    background: #0a0a0a;
    border: 2px solid #00ff88;
    border-radius: 1rem;
    box-shadow: 0 0 20px #00ff8855;
  }

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.7rem;
    color: #00ff88;
    text-shadow: 0 0 6px #00ff88;
  }

  .form-group {
    margin-bottom: 1.2rem;
  }

  label {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: bold;
    font-size: 0.95rem;
    color: #00ff88;
  }

  input {
    width: 100%;
    padding: 0.8rem;
    background: #000;
    border: 1px solid #00ff88;
    color: #00ff88;
    border-radius: 0.4rem;
    font-size: 1rem;
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
    margin-top: 0.8rem;
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

  button:disabled {
    opacity: 0.5;
    cursor: default;
  }

  button:hover:enabled {
    background: #00dd77;
    transform: scale(1.02);
  }

  .error {
    margin-top: 1rem;
    text-align: center;
    color: #ff4455;
    font-size: 0.95rem;
  }

  .footer {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.95rem;
    color: #aaaaaa;
  }

  .footer a {
    color: #00ff88;
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.2s;
  }

  .footer a:hover {
    color: #00ffaa;
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

<div class="form-wrapper">
  <h2>Registro</h2>
  <form id="registerForm">
    <div class="form-group">
      <label for="username">Cómo querés llamarte</label>
      <input id="username" type="text" required placeholder="Usuario" />
    </div>
    <div class="form-group">
      <label for="email">Correo electrónico</label>
      <input id="email" type="email" required placeholder="correo@example.com" />
    </div>
    <div class="form-group">
      <label for="password">Poné tu contraseña</label>
      <input id="password" type="password" required placeholder="Mínimo 6 caracteres" />
    </div>
    <div class="form-group">
      <label for="confirm">Confirmala tu contraseña porfis</label>
      <input id="confirm" type="password" required placeholder="Repite tu contraseña" />
    </div>
    <button type="submit" id="submitBtn">Crear cuenta</button>
    <div class="error" id="errorMsg"></div>
  </form>
  <div class="footer">
    Si ya tenés cuenta, metete de una <a id="loginLink">Iniciá sesión</a>
  </div>
</div>


    `;
  }

  private setupEvents() {
    const form      = this.shadow.getElementById("registerForm") as HTMLFormElement;
    const username  = this.shadow.getElementById("username")    as HTMLInputElement;
    const email     = this.shadow.getElementById("email")       as HTMLInputElement;
    const password  = this.shadow.getElementById("password")    as HTMLInputElement;
    const confirm   = this.shadow.getElementById("confirm")     as HTMLInputElement;
    const errorMsg  = this.shadow.getElementById("errorMsg")    as HTMLDivElement;
    const submitBtn = this.shadow.getElementById("submitBtn")   as HTMLButtonElement;
    const loginLink = this.shadow.getElementById("loginLink")   as HTMLAnchorElement;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorMsg.textContent = "";

      const u = username.value.trim();
      const m = email.value.trim();
      const p = password.value;
      const c = confirm.value;

      if (!u || !m || !p || !c) {
        errorMsg.textContent = "Todos los campos son obligatorios.";
        return;
      }
      if (p !== c) {
        errorMsg.textContent = "Las contraseñas no coinciden.";
        return;
      }
      if (p.length < 6) {
        errorMsg.textContent = "La contraseña debe tener al menos 7 caracteres pues";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Registrando...";

      try {
        const result = await registerUser(m, p, u);
        if (result.success && result.user) {
          localStorage.setItem("userId", result.user.uid);
          window.location.href = "/tasks";
        } else {
          throw new Error((result.error as any)?.message || "Error al registrar");
        }
      } catch (err: any) {
        errorMsg.textContent = err.message;
        submitBtn.disabled = false;
        submitBtn.textContent = "Crear cuenta";
      }
    });

    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent("route-change", {
        bubbles: true,
        composed: true,
        detail: { path: "/login" }
      }));
    });
  }
}

if (!customElements.get("the-register")) {
  customElements.define("the-register", Register);
}
export default Register;
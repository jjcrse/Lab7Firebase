import { onAuthChange } from "../services/firebase/auth-service";

class LandingPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.renderSkeleton();
    this.handleAuth();
  }

  private renderSkeleton() {
    this.shadowRoot!.innerHTML = `
      <style>
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600&display=swap");

        :host {
          display: block;
          font-family: 'Orbitron', sans-serif;
          --bg-color: #0d0d0d;
          --neon-pink: #ff00c8;
          --neon-blue: #00ffe7;
          --neon-purple: #a100ff;
          --text-light: #f0f0f0;
          --text-muted: #999;
          --card-bg: #1a1a1a;
          --btn-radius: 30px;
        }

        .container {
          padding: 50px 20px;
          max-width: 900px;
          margin: auto;
          text-align: center;
          background: var(--bg-color);
          min-height: 100vh;
        }

        .auth-box {
          background: var(--card-bg);
          border: 2px solid var(--neon-purple);
          border-radius: 16px;
          padding: 40px 30px;
          box-shadow: 0 0 15px var(--neon-blue);
        }

        h1 {
          font-size: 2.8rem;
          color: var(--neon-blue);
          text-shadow: 0 0 5px var(--neon-blue), 0 0 15px var(--neon-pink);
        }

        p {
          color: var(--text-muted);
          font-size: 1.1rem;
          margin: 20px 0;
        }

        .actions {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          gap: 25px;
          flex-wrap: wrap;
        }

        button {
          font-size: 1rem;
          padding: 14px 28px;
          border-radius: var(--btn-radius);
          border: none;
          cursor: pointer;
          color: #fff;
          background: linear-gradient(135deg, var(--neon-blue), var(--neon-pink));
          box-shadow: 0 0 10px var(--neon-blue);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        button:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 20px var(--neon-pink), 0 0 25px var(--neon-blue);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 600px) {
          h1 {
            font-size: 2rem;
          }

          .actions {
            flex-direction: column;
            gap: 15px;
          }

          button {
            width: 100%;
            max-width: 250px;
          }
        }
      </style>

      <div class="container">
        <!-- contenido dinámico -->
      </div>
    `;
  }

  private handleAuth() {
    onAuthChange(user => {
      if (user) {
        window.history.pushState({}, "", "/tasks");
        this.dispatchEvent(new CustomEvent("route-change", {
          bubbles: true,
          composed: true,
          detail: { path: "/tasks" },
        }));
      } else {
        this.showAuthOptions();
      }
    });
  }

  private showAuthOptions() {
    const container = this.shadowRoot!.querySelector(".container") as HTMLElement;
    container.innerHTML = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  :host {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    background-color: #000;
    color: #00ff88;
    padding: 2rem;
    border: 2px solid #00ff88;
    border-radius: 1rem;
    box-shadow: 0 0 20px #00ff8855;
    max-width: 480px;
    margin: 3rem auto;
    text-align: center;
    animation: fadeIn 0.6s ease-in-out;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #00ff88;
    text-shadow: 0 0 6px #00ff88aa;
  }

  p {
    margin: 0.6rem 0;
    color: #66ffbb;
    font-size: 1rem;
  }

  small {
    display: block;
    margin-top: 0.3rem;
    color: #55ffaa;
    font-size: 0.9rem;
  }

  .actions {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  button {
    padding: 0.75rem 1.6rem;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 0.5rem;
    color: #000;
    background: #00ff88;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 0 10px #00ff8844;
  }

  button:hover {
    background: #00ffaa;
    transform: scale(1.06);
    box-shadow: 0 0 12px #00ffaa88;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

<div class="auth-box">
  <h1>Holi</h1>
  <p>Hola Leider o Kevin, aquí ya pueden organizar sus cositas pa que sepan</p>
  <p><small>Inicien sesión o regístrense pa saber su IP XD</small></p>
  <div class="actions">
    <button id="login-btn">Iniciar sesión</button>
    <button id="register-btn">Registrarse</button>
  </div>
</div>


    `;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    const loginBtn = this.shadowRoot!.getElementById("login-btn") as HTMLElement;
    const registerBtn = this.shadowRoot!.getElementById("register-btn") as HTMLElement;

    loginBtn.addEventListener("click", () => {
      window.history.pushState({}, "", "/login");
      this.dispatchEvent(new CustomEvent("route-change", {
        bubbles: true,
        composed: true,
        detail: { path: "/login" },
      }));
    });

    registerBtn.addEventListener("click", () => {
      window.history.pushState({}, "", "/register");
      this.dispatchEvent(new CustomEvent("route-change", {
        bubbles: true,
        composed: true,
        detail: { path: "/register" },
      }));
    });
  }
}


export default LandingPage;
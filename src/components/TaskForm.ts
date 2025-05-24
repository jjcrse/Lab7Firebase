class TaskForm extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.handleFormEvents();
  }

  private render() {
    this.shadow.innerHTML = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  :host {
    display: block;
    max-width: 500px;
    margin: 0 auto;
    padding: 1.5rem;
    background: #111;
    border: 2px solid #00ff88;
    border-radius: 1rem;
    box-shadow: 0 0 15px #00ff8866;
    font-family: 'Share Tech Mono', monospace;
    color: #00ff88;

  }

  h3 {
    text-align: center;
    margin-bottom: 1.2rem;
    font-size: 1.5rem;
    color: #00ff88;
    text-shadow: 0 0 5px #00ff88;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  label {
    font-weight: bold;
    margin-bottom: 0.3rem;
    font-size: 0.95rem;
    color: #00ff88;
  }

  input, textarea {
    background-color: #000;
    border: 1px solid #00ff8844;
    border-radius: 8px;
    padding: 0.8rem;
    font-size: 1rem;
    color: #00ff88;
    resize: none;
    transition: border-color 0.2s, background-color 0.2s;
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: #00ffaa;
    background: #002b1e;
    box-shadow: 0 0 6px #00ff8899;
  }

  textarea {
    min-height: 100px;
  }

  button {
    background: #00ff88;
    color: #000;
    font-weight: bold;
    border: none;
    border-radius: 0.5rem;
    padding: 0.9rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s ease;
  }

  button:hover {
    background: #00dd77;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px #00ff8855;
  }

  button:active {
    transform: translateY(1px);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>

<h3>Crear nueva tarea</h3>
<form id="taskForm">
  <div>
    <label for="title">Título</label>
    <input type="text" id="title" placeholder="Ej: Comprar materiales" required />
  </div>
  <div>
    <label for="description">Descripción</label>
    <textarea id="description" placeholder="Ej: Ir a la tienda por papel y lápices..."></textarea>
  </div>
  <button type="submit">Agregar tarea</button>
</form>

    `;
  }

  private handleFormEvents() {
    const form = this.shadow.getElementById("taskForm") as HTMLFormElement;
    const title = this.shadow.getElementById("title") as HTMLInputElement;
    const description = this.shadow.getElementById("description") as HTMLTextAreaElement;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const taskTitle = title.value.trim();
      const taskDescription = description.value.trim();

      if (!taskTitle) return;

      this.dispatchEvent(new CustomEvent("task-submitted", {
        bubbles: true,
        composed: true,
        detail: { title: taskTitle, description: taskDescription }
      }));

      form.reset();
    });
  }
}


export default TaskForm;
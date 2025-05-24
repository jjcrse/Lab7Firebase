import { TaskType } from "../types/TypesDB";
import {
  subscribeTasksByUser,
  addTask as svcAddTask,
  updateTask as svcUpdateTask,
  deleteTask as svcDeleteTask
} from "../services/firebase/TaskService";
import { logoutUser } from "../services/firebase/auth-service";

class TaskPage extends HTMLElement {
  private tasks: TaskType[] = [];
  private unsubscribeTasks?: () => void;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.attachEvents();
    this.startRealtimeSubscription();
  }

  disconnectedCallback() {
    this.unsubscribeTasks?.();
  }

  private render() {
    this.shadowRoot!.innerHTML = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  :host {
    --bg: #000a0f;
    --text: #00ffcc;
    --card-bg: #001a1a;
    --accent: #00ffcc;
    --warning: #ffee00;
    --success: #00ffaa;
    --danger: #ff3377;
    font-family: 'Share Tech Mono', monospace;
    display: block;
  }

  .container {
    padding: 2rem;
    background: var(--bg);
    min-height: 100vh;
    color: var(--text);
    animation: fadeIn 0.6s ease-in-out;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .top-bar h1 {
    color: var(--accent);
    font-size: 2.2rem;
    margin: 0;
    text-shadow: 0 0 6px var(--accent);
  }

  button {
    background: var(--accent);
    color: #000;
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 2rem;
    cursor: pointer;
    font-weight: bold;
    font-size: 0.95rem;
    transition: background 0.3s, transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 0 8px var(--accent);
  }

  button:hover {
    background: var(--success);
    transform: scale(1.05);
    box-shadow: 0 0 12px var(--success);
  }

  #logout-btn {
    background: transparent;
    border: 1px solid var(--accent);
    color: var(--accent);
    box-shadow: none;
  }

  .tasks {
    display: grid;
    gap: 2rem;
  }

  .section {
    background: var(--card-bg);
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 0 15px #00ff8844;
  }

  .section h2 {
    margin-top: 0;
    color: var(--accent);
    font-size: 1.5rem;
    border-bottom: 1px solid var(--accent);
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }

  .list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #002222;
    margin-bottom: 0.6rem;
    padding: 0.85rem;
    border-radius: 0.6rem;
    box-shadow: 0 0 8px #00ff8844;
    transition: background 0.3s;
  }

  .list li:hover {
    background: #003333;
  }

  .list li.done {
    opacity: 0.5;
    text-decoration: line-through;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  .actions button {
    background: none;
    border: none;
    color: var(--accent);
    font-size: 1.3rem;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .actions button:hover {
    transform: scale(1.4);
  }

  .empty {
    color: #55aa99;
    text-align: center;
    font-style: italic;
    padding: 1rem 0;
  }

  .modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.4s ease-in-out;
  }

  .modal-box {
    background: var(--card-bg);
    padding: 1.5rem;
    border-radius: 1rem;
    width: 90%;
    max-width: 420px;
    box-shadow: 0 0 14px var(--accent);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .close {
    background: none;
    border: none;
    font-size: 1.6rem;
    color: var(--danger);
    cursor: pointer;
  }

  input {
    width: 100%;
    margin-bottom: 1rem;
    padding: 0.7rem;
    border: 1px solid var(--accent);
    border-radius: 6px;
    background: #001111;
    color: var(--text);
    font-size: 1rem;
  }

  input:focus {
    outline: none;
    border-color: var(--success);
    background: #002222;
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

<div class="container">
  <div class="top-bar">
    <h1>Tareas</h1>
    <div>
      <button id="add-btn">+ Nueva</button>
      <button id="logout-btn">Cerrar sesión</button>
    </div>
  </div>

  <div class="tasks">
    <div class="section" id="pending-section">
      <h2>Pendientes</h2>
      <ul class="list" id="pending-list"></ul>
    </div>
    <div class="section" id="completed-section">
      <h2>Completadas</h2>
      <ul class="list" id="completed-list"></ul>
    </div>
  </div>
</div>


    `;
  }

  private attachEvents() {
    this.shadowRoot!.getElementById("add-btn")!
      .addEventListener("click", () => this.showModal());
    this.shadowRoot!.getElementById("logout-btn")!
      .addEventListener("click", async () => {
        await logoutUser();
        this.unsubscribeTasks?.();
        window.location.href = "/";
      });
  }

  private startRealtimeSubscription() {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    this.unsubscribeTasks = subscribeTasksByUser(userId, tasks => {
      this.tasks = tasks;
      this.renderTasks();
    });
  }

  private renderTasks() {
    const pendEl = this.shadowRoot!.getElementById("pending-list") as HTMLUListElement;
    const compEl = this.shadowRoot!.getElementById("completed-list") as HTMLUListElement;

    const pending = this.tasks.filter(t => t.status !== "completed");
    const completed = this.tasks.filter(t => t.status === "completed");

    pendEl.innerHTML = pending.length
      ? pending.map(t => this.taskItemHTML(t, false)).join("")
      : `<li class="empty">No hay tareas pendientes</li>`;

    compEl.innerHTML = completed.length
      ? completed.map(t => this.taskItemHTML(t, true)).join("")
      : `<li class="empty">No hay tareas completadas</li>`;

    // attach listeners
    this.shadowRoot!.querySelectorAll(".btn-complete").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = (e.currentTarget as HTMLElement).dataset.id!;
        this.toggleStatus(id);
      });
    });
    this.shadowRoot!.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = (e.currentTarget as HTMLElement).dataset.id!;
        this.deleteTask(id);
      });
    });
  }

  private taskItemHTML(task: TaskType, done: boolean) {
    return `
<li class="task-item ${done ? "done" : ""}">
  <div class="task-content">
    <span class="task-title">${task.title}</span>
    <div class="task-meta">
      <span class="status">${done ? "🟢 Finalizada" : "🕒 En progreso"}</span>
    </div>
  </div>
  <div class="actions">
    <button class="btn-complete" data-id="${task.id}" title="${done ? "Marcar como pendiente" : "Marcar como finalizada"}">
      ${done ? "🔁" : "🚀"}
    </button>
    <button class="btn-delete" data-id="${task.id}" title="Eliminar tarea">🧨</button>
  </div>
</li>


    `;
  }

  private async toggleStatus(id: string) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;
    const next = task.status === "completed" ? "todo" : "completed";
    const ok = await svcUpdateTask(id, { status: next });
    if (!ok) console.error("Error al actualizar estado");
  }

  private async deleteTask(id: string) {
    const ok = await svcDeleteTask(id);
    if (!ok) console.error("Error al eliminar tarea");
  }

  private showModal() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <h2>Nueva tarea</h2>
          <button class="close">✖</button>
        </div>
        <input id="title" placeholder="Título *" required />
        <input id="desc" placeholder="Metele mmas  detalle pues" />
        <div style="text-align:right">
          <button id="cancel">Cancelar</button>
          <button id="save">Guardar</button>
        </div>
      </div>
    `;
    this.shadowRoot!.appendChild(modal);

    modal.querySelector(".close")!.addEventListener("click", () => modal.remove());
    modal.querySelector("#cancel")!.addEventListener("click", () => modal.remove());

    modal.querySelector("#save")!.addEventListener("click", async () => {
      const title = (modal.querySelector("#title")! as HTMLInputElement).value.trim();
      const desc  = (modal.querySelector("#desc")!  as HTMLInputElement).value.trim();
      if (!title) return alert("El título es obligatorio");
      const uid = localStorage.getItem("userId")!;
      await svcAddTask({ userId: uid, title, description: desc, status: "todo" });
      modal.remove();
    });
  }
}


export default TaskPage;
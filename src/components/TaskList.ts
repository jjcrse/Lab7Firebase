class TaskList extends HTMLElement {
  private tasks: TaskItem[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["status"];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.loadTasks();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) this.render();
  }

  get status() {
    return this.getAttribute("status") || "pending";
  }

  setupEventListeners() {
    document.addEventListener("task-added", ((e: CustomEvent) => {
      if (this.status === "pending") this.addTask(e.detail.task);
    }) as EventListener);

    this.shadowRoot?.addEventListener("task-toggle-complete", ((e: CustomEvent) => {
      this.toggleTaskComplete(e.detail.taskId);
    }) as EventListener);

    this.shadowRoot?.addEventListener("task-delete", ((e: CustomEvent) => {
      this.deleteTask(e.detail.taskId);
    }) as EventListener);

    const container = this.shadowRoot?.querySelector(".task-zone");
    container?.addEventListener("dragover", (e) => {
      e.preventDefault();
      container.classList.add("highlight-drop");
    });

    container?.addEventListener("dragleave", () => {
      container.classList.remove("highlight-drop");
    });

    container?.addEventListener("drop", ((e: DragEvent) => {
      e.preventDefault();
      container.classList.remove("highlight-drop");
      const taskId = e.dataTransfer?.getData("text/plain");
      if (taskId) this.moveTaskToStatus(taskId, this.status);
    }) as EventListener);
  }

  loadTasks() {
    const raw = localStorage.getItem("tasks");
    if (raw) {
      const all = JSON.parse(raw);
      this.tasks = this.filterTasksByStatus(all);
      this.render();
    }
  }

  filterTasksByStatus(allTasks: TaskItem[]) {
    const s = this.status;
    return allTasks.filter(t =>
      (s === "pending" && !t.completed && !t.inProgress && !t.inReview) ||
      (s === "in-progress" && t.inProgress && !t.completed && !t.inReview) ||
      (s === "review" && t.inReview && !t.completed) ||
      (s === "completed" && t.completed)
    );
  }

  saveTasks() {
    const saved = localStorage.getItem("tasks");
    let all: TaskItem[] = saved ? JSON.parse(saved) : [];

    all = all.filter(t => {
      const s = this.status;
      return (
        (s === "pending" && (t.inProgress || t.inReview || t.completed)) ||
        (s === "in-progress" && (!t.inProgress || t.inReview || t.completed)) ||
        (s === "review" && (!t.inReview || t.completed)) ||
        (s === "completed" && !t.completed)
      );
    });

    localStorage.setItem("tasks", JSON.stringify([...all, ...this.tasks]));
  }

  addTask(task: TaskItem) {
    const s = this.status;
    task.inProgress = s === "in-progress";
    task.inReview = s === "review";
    task.completed = s === "completed";
    this.tasks.push(task);
    this.saveTasks();
    this.render();
  }

  toggleTaskComplete(id: string) {
    this.tasks = this.tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    this.saveTasks();
    this.render();
  }

  deleteTask(id: string) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
    this.render();
  }

  moveTaskToStatus(taskId: string, status: string) {
    const raw = localStorage.getItem("tasks");
    if (!raw) return;
    const all: TaskItem[] = JSON.parse(raw);
    const task = all.find(t => t.id === taskId);
    if (!task) return;

    task.inProgress = status === "in-progress";
    task.inReview = status === "review";
    task.completed = status === "completed";
    if (status === "pending") {
      task.inProgress = task.inReview = task.completed = false;
    }

    localStorage.setItem("tasks", JSON.stringify(all));
    document.dispatchEvent(new CustomEvent("tasks-updated"));
    this.loadTasks();
  }

  render() {
    if (!this.shadowRoot) return;

    const pending = this.tasks.filter(t => !t.completed);
    const done = this.tasks.filter(t => t.completed);

    this.shadowRoot.innerHTML = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  :host {
    display: block;
    font-family: 'Share Tech Mono', monospace;
  }

  .task-zone {
    display: grid;
    gap: 1.5rem;
    background: #000;
    border: 2px dashed #00ff8844;
    padding: 1.2rem;
    border-radius: 1rem;
    box-shadow: 0 0 15px #00ff8844;
  }

  .section {
    background: #0a0a0a;
    border-left: 4px solid #00ff88;
    padding: 1rem;
    border-radius: 0.75rem;
    box-shadow: 0 0 8px #00ff8844;
  }

  .section h3 {
    color: #00ff88;
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
    border-bottom: 1px solid #00ff8844;
    padding-bottom: 0.4rem;
    text-shadow: 0 0 5px #00ff88;
  }

  ul.task-list {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0 0 0;
  }

  li.task {
    background: #111;
    color: #00ff88;
    margin-bottom: 10px;
    padding: 0.9rem;
    border-radius: 8px;
    box-shadow: 0 0 6px #00ff8844;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #00ff8833;
    transition: background 0.3s;
  }

  li.task.done {
    opacity: 0.5;
    text-decoration: line-through;
    background: #001b14;
  }

  .task-info {
    flex: 1;
  }

  .title {
    font-weight: 600;
    margin-bottom: 4px;
    color: #00ffaa;
  }

  .desc {
    font-size: 0.85rem;
    color: #66ffc2;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  button {
    background: transparent;
    border: 1px solid #00ff88;
    color: #00ff88;
    padding: 0.4rem 0.7rem;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  button:hover {
    background: #00ff88;
    color: #000;
  }

  .empty {
    color: #00885e;
    font-style: italic;
    text-align: center;
  }

  .highlight-drop {
    outline: 2px dashed #00ff88;
    background-color: #001f1a;
  }
</style>

<div class="task-zone">
  <div class="section">
    <h3>Pendientes (${pending.length})</h3>
    ${pending.length
      ? `<ul class="task-list">
          ${pending.map(t => `
            <li class="task" data-id="${t.id}">
              <div class="task-info">
                <div class="title">${t.title}</div>
                ${t.description ? `<div class="desc">${t.description}</div>` : ""}
              </div>
              <div class="actions">
                <button class="complete-btn">✔</button>
                <button class="delete-btn">✖</button>
              </div>
            </li>`).join("")}
        </ul>`
      : `<p class="empty">No hay tareas pendientes</p>`
    }
  </div>

  <div class="section">
    <h3>Completadas (${done.length})</h3>
    ${done.length
      ? `<ul class="task-list">
          ${done.map(t => `
            <li class="task done" data-id="${t.id}">
              <div class="task-info">
                <div class="title">${t.title}</div>
                ${t.description ? `<div class="desc">${t.description}</div>` : ""}
              </div>
              <div class="actions">
                <button class="complete-btn">↺</button>
                <button class="delete-btn">✖</button>
              </div>
            </li>`).join("")}
        </ul>`
      : `<p class="empty">No hay tareas completadas</p>`
    }
  </div>
</div>

    `;

    
    this.shadowRoot.querySelectorAll(".complete-btn")
      .forEach(btn => {
        btn.addEventListener("click", e => {
          const li = (e.currentTarget as HTMLElement).closest("li.task") as HTMLElement;
          const id = li.dataset.id!;
          this.toggleTaskComplete(id);
        });
      });

    this.shadowRoot.querySelectorAll(".delete-btn")
      .forEach(btn => {
        btn.addEventListener("click", e => {
          const li = (e.currentTarget as HTMLElement).closest("li.task") as HTMLElement;
          const id = li.dataset.id!;
          this.deleteTask(id);
        });
      });
  }
}

interface TaskItem {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  inProgress?: boolean;
  inReview?: boolean;
}

export default TaskList;
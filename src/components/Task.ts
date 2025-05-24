class Task extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['id', 'title', 'description', 'status'];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  private setupListeners() {
    const statusBtns = this.shadowRoot?.querySelectorAll<HTMLButtonElement>('.btn-status');
    statusBtns?.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        const newStatus = target.dataset.status!;
        this.setAttribute('status', newStatus);
        this.dispatchEvent(new CustomEvent('task-status-changed', {
          bubbles: true,
          composed: true,
          detail: {
            id: this.getAttribute('id'),
            status: newStatus
          }
        }));
      });
    });

    const deleteBtn = this.shadowRoot?.querySelector<HTMLButtonElement>('.btn-delete');
    deleteBtn?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('task-deleted', {
        bubbles: true,
        composed: true,
        detail: { id: this.getAttribute('id') }
      }));
    });
  }

  private getStatusText(status: string) {
    switch (status) {
      case 'todo': return 'Por hacer';
      case 'in-progress': return 'En progreso';
      case 'completed': return 'Completada';
      default: return 'Desconocido';
    }
  }

  private render() {
    const title = this.getAttribute('title') || 'Sin título';
    const description = this.getAttribute('description') || '';
    const status = this.getAttribute('status') || 'todo';

    this.shadowRoot!.innerHTML = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  :host {
    display: block;
    font-family: 'Share Tech Mono', monospace;
  }

  .card {
    border-radius: 1rem;
    padding: 1rem;
    margin: 1rem 0;
    background: #111;
    border: 2px solid #00ff88;
    box-shadow: 0 0 15px #00ff8866;
    transition: background 0.3s ease;
    color: #00ff88;

  }

  .card[data-status="todo"] {
    border-left: 5px solid #00ffaa;
  }

  .card[data-status="in-progress"] {
    border-left: 5px solid #ffff66;
  }

  .card[data-status="completed"] {
    border-left: 5px solid #66ff99;
    opacity: 0.9;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-size: 1.2rem;
    margin: 0;
    color: #00ff88;
    text-shadow: 0 0 3px #00ff88;
  }

  .tag {
    padding: 0.2rem 0.6rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    background: #00ff8833;
    color: #00ff88;
  }

  .tag.todo {
    background: #00ffaa22;
    color: #00ffaa;
  }

  .tag.in-progress {
    background: #ffff6622;
    color: #ffff66;
  }

  .tag.completed {
    background: #66ff9922;
    color: #66ff99;
  }

  .description {
    margin: 0.8rem 0;
    color: #bfffd0;
    font-size: 0.95rem;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .controls {
    display: flex;
    gap: 0.5rem;
  }

  button {
    border: none;
    border-radius: 6px;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    background: transparent;
    color: #00ff88;
    cursor: pointer;
    outline: 1px solid #00ff8844;
    transition: all 0.2s ease-in-out;
  }

  button.active {
    background: #00ff88;
    color: #000;
  }

  .btn-delete {
    background: #ff3366;
    color: #fff;
    border: none;
    transition: background 0.3s;
  }

  .btn-delete:hover {
    background: #cc0033;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>

<div class="card" data-status="${status}">
  <div class="header">
    <h3 class="title">${title}</h3>
    <span class="tag ${status}">${this.getStatusText(status)}</span>
  </div>
  <p class="description">${description}</p>
  <div class="footer">
    <div class="controls">
      <button class="btn-status ${status==='todo'?'active':''}" data-status="todo">Por hacer</button>
      <button class="btn-status ${status==='in-progress'?'active':''}" data-status="in-progress">En progreso</button>
      <button class="btn-status ${status==='completed'?'active':''}" data-status="completed">Completada</button>
    </div>
    <button class="btn-delete">Eliminar</button>
  </div>
</div>

    `;
  }
}


export default Task;

import "./components/Login";
import "./components/Register";
import "./components/TaskList";
 

import TasksPage from "./pages/TaskPage";
import LandingPage from "./pages/Landing";
import TaskForm from "./components/TaskForm";
import FourPage from "./pages//FourPage";
import Task from "./components/Task";
import RootApp from "./root/Root";
import Root from "./root/Root";

customElements.define("root-app", Root);
customElements.define('neon-task-card', Task);
customElements.define("neon-page", FourPage);
customElements.define("task-form", TaskForm);
customElements.define("main-page", LandingPage);
customElements.define("tasks-page", TasksPage);
window.addEventListener("DOMContentLoaded", () => {
  const app = document.createElement("root-app");
  document.body.appendChild(app);
});

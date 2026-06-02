import { useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { useAuth } from "../hooks/useAuth";
import TaskCard from "../components/TaskCard";
import CreateTaskForm from "../components/CreateTaskForm";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Task Manager</h1>
        <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </header>

      <main className={styles.main}>
        {error && <p className={styles.error}>{error}</p>}
        <CreateTaskForm onCreate={createTask} />

        {loading ? (
          <p className={styles.empty}>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className={styles.empty}>No tasks yet. Create one above.</p>
        ) : (
          <div className={styles.grid}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
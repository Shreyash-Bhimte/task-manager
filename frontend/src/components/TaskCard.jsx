import { useState } from "react";
import styles from "./TaskCard.module.css";

const STATUS_LABELS = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);

  function handleSave() {
    onUpdate(task.id, { title, description, status });
    setEditing(false);
  }

  return (
    <div className={styles.card}>
      {editing ? (
        <div className={styles.editForm}>
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
          <select
            className={styles.select}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <div className={styles.actions}>
            <button className={styles.saveBtn} onClick={handleSave}>Save</button>
            <button className={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <span className={`${styles.badge} ${styles[task.status]}`}>
              {STATUS_LABELS[task.status]}
            </span>
            <div className={styles.actions}>
              <button className={styles.editBtn} onClick={() => setEditing(true)}>Edit</button>
              <button className={styles.deleteBtn} onClick={() => onDelete(task.id)}>Delete</button>
            </div>
          </div>
          <h3 className={styles.title}>{task.title}</h3>
          {task.description && <p className={styles.desc}>{task.description}</p>}
        </>
      )}
    </div>
  );
}
import { useState } from "react";
import styles from "./CreateTaskForm.module.css";

export default function CreateTaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [open, setOpen] = useState(false);

  function handleSubmit() {
    if (!title.trim()) return;
    onCreate({ title, description, status }, () => {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <button className={styles.addBtn} onClick={() => setOpen(true)}>
        + New Task
      </button>
    );
  }

  return (
    <div className={styles.form}>
      <input
        className={styles.input}
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className={styles.textarea}
        placeholder="Description (optional)"
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
        <button className={styles.createBtn} onClick={handleSubmit}>Create</button>
        <button className={styles.cancelBtn} onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </div>
  );
}
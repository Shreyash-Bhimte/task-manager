import { useState, useEffect } from "react";
import api from "../lib/axios";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  async function createTask(data, onSuccess) {
    try {
      const res = await api.post("/tasks", data);
      setTasks((prev) => [res.data, ...prev]);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create task");
    }
  }

  async function updateTask(id, data) {
    try {
      const res = await api.put(`/tasks/${id}`, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update task");
    }
  }

  async function deleteTask(id) {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete task");
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, loading, error, createTask, updateTask, deleteTask };
}
import { useState } from "react";
import api from "../lib/axios";

export function useAuth() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function register(email, password, onSuccess) {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/register", { email, password });
      localStorage.setItem("token", res.data.access_token);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password, onSuccess) {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
  }

  return { register, login, logout, error, loading };
}
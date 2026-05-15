// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

// Create context
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Check if token exists -> fetch user
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get("/users/me");
          setUser(res.data.user);
        } catch (err) {
          console.error("Auth error:", err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await api.post("/users/login", { email, password });
      console.log("Login response:", res.data);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data; // return so caller can use if needed
    } catch (err) {
        throw err; // 🔥 let Login.jsx handle errors
  }
  };

  // Register function
  const register = async (name, email, password) => {
    const res = await api.post("/users/register", { name, email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

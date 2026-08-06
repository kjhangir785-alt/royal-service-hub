import { createContext, useContext, useEffect, useState } from "react";
import { api, TOKEN_KEY } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = checking, false = logged out, object = logged in
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");

  useEffect(() => {
    let active = true;
    const check = async () => {
      if (!token) {
        setUser(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        if (active) setUser(data);
      } catch (e) {
        localStorage.removeItem(TOKEN_KEY);
        if (active) {
          setToken("");
          setUser(false);
        }
      }
    };
    check();
    return () => { active = false; };
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "trello_lite_token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  useEffect(() => {
    const restore = async () => {
      if (!localStorage.getItem(TOKEN_KEY)) return setLoading(false);
      try {
        const data = await api.me();
        setUser(data.user);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    restore();
    window.addEventListener("auth:unauthorized", logout);
    return () => window.removeEventListener("auth:unauthorized", logout);
  }, []);

  const authenticate = async (mode, credentials) => {
    const data = await api[mode](credentials);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login: (credentials) => authenticate("login", credentials),
      register: (credentials) => authenticate("register", credentials),
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

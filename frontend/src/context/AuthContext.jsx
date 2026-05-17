import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("skillswap_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("skillswap_token");
    if (!token) return;

    setLoading(true);
    api
      .get("/auth/me")
      .then((response) => {
        setUser(response.data.user);
        localStorage.setItem("skillswap_user", JSON.stringify(response.data.user));
      })
      .catch(() => {
        localStorage.removeItem("skillswap_token");
        localStorage.removeItem("skillswap_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const authenticate = async (path, payload) => {
    const response = await api.post(path, payload);
    localStorage.setItem("skillswap_token", response.data.token);
    localStorage.setItem("skillswap_user", JSON.stringify(response.data.user));
    setUser(response.data.user);
    return response.data.user;
  };

  const logout = () => {
    localStorage.removeItem("skillswap_token");
    localStorage.removeItem("skillswap_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login: (payload) => authenticate("/auth/login", payload),
      register: (payload) => authenticate("/auth/register", payload),
      logout,
      setUser
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

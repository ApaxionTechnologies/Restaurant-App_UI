import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to fetch current user (backend reads HttpOnly cookie)
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await axios.get("http://localhost:5001/api/auth/me", {
          withCredentials: true,
        });
        setUser(res.data.user || null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, []);

  const logout = async () => {
    try {
      await axios.post("http://localhost:5001/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      /* ignore */
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

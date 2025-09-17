// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchMe() {
//       try {
//         const res = await axios.get("http://localhost:5001/api/auth/me", {
//           withCredentials: true,
//         });
//         setUser(res.data.user || null);
//       } catch (err) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchMe();
//   }, []);

//   const logout = async () => {
//     try {
//       await axios.post("http://localhost:5001/api/auth/logout", {}, { withCredentials: true });
//     } catch (err) {
//       /* ignore */
//     } finally {
//       setUser(null);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
import React, { createContext, useState, useEffect } from "react";
import { getMyRestaurant, logoutRestaurant } from "../services/apiService.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await getMyRestaurant();
        setUser(res.restaurant || null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await logoutRestaurant(); 
    } catch (err) {
      console.warn("Logout API error ignored:", err);
    } finally {
    
      localStorage.removeItem("token");
      localStorage.removeItem("restaurantId");
      localStorage.removeItem("tableNumber");
      localStorage.removeItem("adminEmail");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

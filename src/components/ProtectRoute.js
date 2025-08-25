// src/components/ProtectedRoute.js
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); // null = unknown, true/false = auth status

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuth(true); // user logged in
    } else {
      setIsAuth(false); // not logged in
    }
  }, []);

  if (isAuth === null) {
    // token check hone tak kuch render na karo
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/" replace />; // redirect if not logged in
  }

  return children; // render protected page
};

export default ProtectedRoute;

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuth(true); 
    } else {
      setIsAuth(false); 
    }
  }, []);

  if (isAuth === null) {
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return children; 
};

export default ProtectedRoute;

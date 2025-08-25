import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ added
import axios from "axios";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // ✅ added

  useEffect(() => {
    const remembered = JSON.parse(localStorage.getItem("rememberedUser"));
    if (remembered) {
      setEmail(remembered.email);
      setPassword(remembered.password || ""); // password optional
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify({ email }));
      } else {
        localStorage.removeItem("rememberedUser");
      }

      alert("Login successful!");
      navigate("/admin-dashboard"); 
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };


  const handleForgotPassword = () => {
    const storedUser = JSON.parse(localStorage.getItem("restaurantUser"));
    if (storedUser && storedUser.email === email) {
      alert(`Password hint: ${storedUser.password}`); // ⚠️ Not recommended for production
    } else {
      alert("Email not registered.");
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>🔐 Restaurant Login</h2>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i
            className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Hide Password" : "Show Password"}
          />
        </div>

        <div className="login-options">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember Me
          </label>

          <span className="forgot-link" onClick={handleForgotPassword}>
            Forgot Password?
          </span>
        </div>

        {error && <small className="login-error">{error}</small>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

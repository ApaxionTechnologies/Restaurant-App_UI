import React, { useState, useEffect } from "react";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // ✅ Added this
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Auto-fill if user previously checked "Remember Me"
  useEffect(() => {
    const remembered = JSON.parse(localStorage.getItem("rememberedUser"));
    if (remembered) {
      setEmail(remembered.email);
      setPassword(remembered.password);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("restaurantUser"));

    if (!storedUser) {
      setError("No registered user found. Please register first.");
    } else if (storedUser.email === email && storedUser.password === password) {
      setError("");
      alert("Login successful!");

      if (rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem("rememberedUser");
      }

      // TODO: Redirect to dashboard
    } else {
      setError("Invalid email or password.");
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

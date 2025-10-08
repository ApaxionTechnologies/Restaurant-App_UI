import React from "react";
import Footer from "../components/Footer";
import HomeHeader from "../components/HomeHeader"; 
import "../styles/Home.css";
import "./HomePage.css";
import { useState } from "react";
import AdminLogin from "../pages/AdminLogin"; 
import { useEffect } from "react";

export default function HomePage() {
  
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  useEffect(() => {
    document.body.classList.add("home-page");
    document.documentElement.classList.add("home-page"); 

    return () => {
      document.body.classList.remove("home-page");
    };
  }, []);

  return (
    <>
      
      <HomeHeader />

      
      <section
        className="hero-banner"
        style={{
          backgroundImage: "url('/food-collage.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay">
          <h1 className="hero-title">Great Food Great Offers</h1>
        </div>
      </section>

      {/* FOOD COURT SECTION */}
      <section className="food-section">
        <div className="food-card">
          <div className="food-text">
            <h2>FOOD COURT</h2>
            <p>TAKE AWAY | DINE IN</p>
          </div>
          <div className="food-image">
            <img src="/food-court.png" alt="Food Court" />
          </div>
        </div>
      </section>

      
      <Footer />
        
      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      )}
    </>
  );
}
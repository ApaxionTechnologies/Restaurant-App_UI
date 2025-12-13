import React from "react";
import "./HomeHeader.css";
import {  FiCalendar,FiChevronDown } from "react-icons/fi";
import { BsBellFill } from "react-icons/bs";

export default function HomeHeader() {
  return (
    <header className="homeheader">
      <div className="homeheader-inner">

        {/* LEFT SECTION */}
        <div className="homeheader-left">
          <h1 className="homeheader-title">Dashboard</h1>
        </div>

        {/* RIGHT SECTION */}
        <div className="homeheader-right">

          {/* Notification Icon */}
          <div className="homeheader-bell">
            <BsBellFill className="bell-icon" />
          </div>

          {/* User Card */}
          <div className="homeheader-usercard">
            <span className="user-text">
              Hello, <span className="bold">Piyush</span>
            </span>
            <img
              src="./profileimage.png"
              className="user-avatar"
              alt="User"
            />
          </div>

          {/* Filter Period Card */}
          <div className="homeheader-filter">
            <div className="filter-icon-box">
              <FiCalendar className="calendar-icon" />
            </div>
            <div className="filter-text">
              <div className="filter-title">Filter Period</div>
              <div className="filter-date">17 April 2020 - 21 May 2020</div>
            </div>
            <FiChevronDown className="filter-arrow" />
          </div>

        </div>
      </div>
    </header>
  );
}

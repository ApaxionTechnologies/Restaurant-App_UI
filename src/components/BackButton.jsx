// components/BackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go to the previous page
  };

  return (
    <button onClick={handleBack} className="back-button">
      <FaArrowLeft style={{ marginRight: "6px" }} />
      Back
    </button>
  );
};

export default BackButton;

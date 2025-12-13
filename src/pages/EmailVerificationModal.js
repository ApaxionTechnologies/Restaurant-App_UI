import React, { useState, useRef, useEffect } from "react";
import "../styles/EmailVerificationModal.css";
import { verifyOtp, sendOtp } from "../services/authService";

const EmailVerificationModal = ({ isOpen, onClose, email, onVerify }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Start resend timer when modal opens
  useEffect(() => {
    setResendTimer(60);
    setCanResend(false);

    if (isOpen) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    const newOtp = pastedData.split("");
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
    inputRefs.current[newOtp.length < 6 ? newOtp.length : 5]?.focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter complete OTP");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      await verifyOtp(email, otpValue);
      onVerify(true); // Notify parent that email is verified
      onClose();
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60);
    setOtp(["", "", "", "", "", ""]);
    setError("");

    try {
      await sendOtp(email); // Call API to send OTP
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-header">
          <div className="modal-icon"><i className="fas fa-envelope-open-text"></i></div>
          <h2 className="modal-title">Email Verification</h2>
          <p className="modal-subtitle">
            We've sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>

        <div className="modal-body">
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`otp-input ${error ? "error" : ""}`}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && <div className="error-message-modal">{error}</div>}

          <button
            className="verify-button"
            onClick={handleVerify}
            disabled={isVerifying || otp.join("").length !== 6}
          >
            {isVerifying ? (
              <><i className="fas fa-spinner fa-spin"></i> Verifying...</>
            ) : "Verify Email"}
          </button>

          <div className="resend-section">
            {canResend ? (
              <button className="resend-button" onClick={handleResend}>
                <i className="fas fa-redo-alt"></i> Resend Code
              </button>
            ) : (
              <p className="resend-timer">Resend code in <span>{resendTimer}s</span></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;

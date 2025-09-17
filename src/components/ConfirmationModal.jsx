import React from "react";
import { X } from "lucide-react";
import '../styles/confirmationModels.css'

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default", 
  isLoading = false
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          confirmButton: "btn-confirm-danger",
          icon: "🔴",
          header: "text-danger"
        };
      case "warning":
        return {
          confirmButton: "btn-confirm-warning",
          icon: "🟠",
          header: "text-warning"
        };
      case "success":
        return {
          confirmButton: "btn-confirm-success",
          icon: "🟢",
          header: "text-success"
        };
      default:
        return {
          confirmButton: "btn-confirm-default",
          icon: "ℹ️",
          header: "text-primary"
        };
    }
  };

  const typeStyles = getTypeStyles();
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="confirmation-modal">
        <div className="modal-header">
          <div className="title-container">
            <span className="modal-icon">{typeStyles.icon}</span>
            <h3 className={`modal-title ${typeStyles.header}`}>{title}</h3>
          </div>
          <button 
            className="btn-close-modal" 
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <p>{message}</p>
        </div>
        
        <div className="modal-footer">
          <button 
            className="btn-cancel" 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button 
            className={`btn-confirm ${typeStyles.confirmButton}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
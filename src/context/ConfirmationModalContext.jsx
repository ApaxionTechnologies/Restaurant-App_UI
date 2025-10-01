import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmationModal from "../components/ConfirmationModal";
const ConfirmationModalContext = createContext();
export const useConfirmationModal = () => {
  const context = useContext(ConfirmationModalContext);
  if (!context) {
    throw new Error('useConfirmationModal must be used within a ConfirmationModalProvider');
  }
  return context;
};
export const ConfirmationModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "Confirm Action",
    message: "Are you sure you want to proceed?",
    confirmText: "Confirm",
    cancelText: "Cancel",
    type: "default",
    onConfirm: () => {},
    onCancel: () => {}
  });

  const showModal = useCallback((options) => {
    setModalState(prev => ({
      ...prev,
      isOpen: true,
      ...options
    }));
  }, []);

  const hideModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const handleConfirm = useCallback(() => {
    modalState.onConfirm();
    hideModal();
  }, [modalState, hideModal]);

  const handleCancel = useCallback(() => {
    if (modalState.onCancel) {
      modalState.onCancel();
    }
    hideModal();
  }, [modalState, hideModal]);

  const value = {
    showModal,
    hideModal
  };

  return (
    <ConfirmationModalContext.Provider value={value}>
      {children}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        type={modalState.type}
      />
    </ConfirmationModalContext.Provider>
  );
};
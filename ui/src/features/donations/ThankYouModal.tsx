import React from "react";

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThankYouModal: React.FC<ThankYouModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Thank You!</h2>
        <p>Your donation has been received.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ThankYouModal;

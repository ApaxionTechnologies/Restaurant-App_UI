import "../styles/TermsModal.css";

const TermsConditionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="terms-modal-overlay" onClick={onClose}>
      <div className="terms-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="terms-modal-close" onClick={onClose}>×</button>
        
        <div className="terms-modal-header">
          <div className="terms-modal-icon">
            <i className="fas fa-file-contract"></i>
          </div>
          <h2 className="terms-modal-title">Terms & Conditions</h2>
          <p className="terms-modal-subtitle">Please read these terms carefully</p>
        </div>

        <div className="terms-modal-body">
          <section className="terms-section">
            <h3>1. Acceptance of Terms</h3>
            <p>
              By registering and using this restaurant management platform, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="terms-section">
            <h3>2. Restaurant Registration</h3>
            <p>
              You may register multiple restaurants on this platform. Each restaurant registration must provide accurate and complete information including:
            </p>
            <ul>
              <li>Valid business name and registration details</li>
              <li>Accurate contact information</li>
              <li>Correct location and address</li>
              <li>Valid tax identification numbers where applicable</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>3. Account Responsibilities</h3>
            <p>You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring all information provided is accurate and up-to-date</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>4. Restaurant Management</h3>
            <p>
              As a restaurant owner/manager, you have the ability to:
            </p>
            <ul>
              <li>Manage menu items, pricing, and availability</li>
              <li>Process and track orders</li>
              <li>Update restaurant information and operating hours</li>
              <li>Access sales reports and analytics</li>
              <li>Manage staff access and permissions</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>5. Service Fees and Payments</h3>
            <p>
              By using this platform, you agree to pay any applicable service fees, commissions, or subscription charges as outlined in your agreement. Payment terms and fee structures will be communicated clearly during registration.
            </p>
          </section>

          <section className="terms-section">
            <h3>6. Content and Intellectual Property</h3>
            <p>
              You retain ownership of content you upload (menu items, photos, descriptions). However, you grant us a license to use, display, and distribute this content as necessary to provide our services. You must ensure you have the rights to all content you upload.
            </p>
          </section>

          <section className="terms-section">
            <h3>7. Prohibited Activities</h3>
            <p>You agree not to:</p>
            <ul>
              <li>Upload false, misleading, or fraudulent information</li>
              <li>Violate any local, state, or national laws</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Attempt to gain unauthorized access to the platform</li>
              <li>Use the platform for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>8. Service Availability</h3>
            <p>
              While we strive to provide uninterrupted service, we do not guarantee that the platform will be available at all times. We reserve the right to modify, suspend, or discontinue any part of the service with or without notice.
            </p>
          </section>

          <section className="terms-section">
            <h3>9. Termination</h3>
            <p>
              We reserve the right to suspend or terminate your account if you violate these terms or engage in fraudulent activities. You may also terminate your account at any time by contacting our support team.
            </p>
          </section>

          <section className="terms-section">
            <h3>10. Limitation of Liability</h3>
            <p>
              We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our liability is limited to the maximum extent permitted by law.
            </p>
          </section>

          <section className="terms-section">
            <h3>11. Changes to Terms</h3>
            <p>
              We may update these Terms and Conditions from time to time. Continued use of the platform after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="terms-section">
            <h3>12. Contact Information</h3>
            <p>
              If you have any questions about these Terms and Conditions, please contact our support team through the platform.
            </p>
          </section>
        </div>

        <div className="terms-modal-footer">
          <button className="terms-accept-button" onClick={onClose}>
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsModal;
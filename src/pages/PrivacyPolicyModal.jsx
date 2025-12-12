
import "../styles/PrivacyPolicy.css";
const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content terms-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <div className="modal-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h2 className="modal-title">Privacy Policy</h2>
          <p className="modal-subtitle">How we protect and use your data</p>
        </div>

        <div className="modal-body terms-content">
          <section className="terms-section">
            <h3>1. Information We Collect</h3>
            <p>We collect the following types of information:</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, phone number, and password</li>
              <li><strong>Restaurant Information:</strong> Business name, address, tax ID, banking details</li>
              <li><strong>Operational Data:</strong> Menu items, pricing, orders, and sales data</li>
              <li><strong>Usage Data:</strong> How you interact with our platform, IP address, device information</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>2. How We Use Your Information</h3>
            <p>We use collected information to:</p>
            <ul>
              <li>Provide and maintain restaurant management services</li>
              <li>Process transactions and send notifications</li>
              <li>Improve our platform and develop new features</li>
              <li>Communicate with you about updates and support</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>3. Data Sharing and Disclosure</h3>
            <p>
              We do not sell your personal information. We may share your data with:
            </p>
            <ul>
              <li><strong>Service Providers:</strong> Third-party services that help us operate (payment processors, hosting services)</li>
              <li><strong>Customers:</strong> Restaurant information (name, menu, location) is visible to end users</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>4. Data Security</h3>
            <p>
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul>
              <li>Encrypted data transmission (SSL/TLS)</li>
              <li>Secure password storage with hashing</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Backup and disaster recovery systems</li>
            </ul>
            <p>
              However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section className="terms-section">
            <h3>5. Data Retention</h3>
            <p>
              We retain your information for as long as your account is active or as needed to provide services. After account deletion, we may retain certain information for legal compliance, dispute resolution, and fraud prevention purposes.
            </p>
          </section>

          <section className="terms-section">
            <h3>6. Your Rights and Choices</h3>
            <p>You have the right to:</p>
            <ul>
              <li>Access and review your personal information</li>
              <li>Update or correct inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data in a portable format</li>
              <li>Object to certain data processing activities</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>7. Cookies and Tracking</h3>
            <p>
              We use cookies and similar technologies to enhance user experience, analyze usage patterns, and maintain sessions. You can control cookie preferences through your browser settings, but disabling cookies may affect platform functionality.
            </p>
          </section>

          <section className="terms-section">
            <h3>8. Third-Party Services</h3>
            <p>
              Our platform may integrate with third-party services (payment gateways, analytics tools). These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section className="terms-section">
            <h3>9. Children's Privacy</h3>
            <p>
              Our platform is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we become aware of such collection, we will delete the information immediately.
            </p>
          </section>

          <section className="terms-section">
            <h3>10. International Data Transfers</h3>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="terms-section">
            <h3>11. Changes to Privacy Policy</h3>
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant changes via email or platform notification. Continued use after changes indicates acceptance of the updated policy.
            </p>
          </section>

          <section className="terms-section">
            <h3>12. Contact Us</h3>
            <p>
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact our Data Protection team through the platform or at our support email.
            </p>
          </section>
        </div>

        <div className="modal-footer">
          <button className="accept-button" onClick={onClose}>
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};


export default  PrivacyPolicyModal ;
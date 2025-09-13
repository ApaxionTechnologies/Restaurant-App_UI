// src/utils/passwordValidation.js

export const validatePassword = (password) => {
  const uppercase = /[A-Z]/;
  const lowercase = /[a-z]/;
  const number = /[0-9]/;
  const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

  return {
    hasMinLength: password?.length >= 6,
    hasUppercase: uppercase.test(password),
    hasLowercase: lowercase.test(password),
    hasNumber: number.test(password),
    hasSpecialChar: specialChar.test(password),
    isValid:
      password?.length >= 6 &&
      uppercase.test(password) &&
      lowercase.test(password) &&
      number.test(password) &&
      specialChar.test(password),
  };
};

export const PasswordRequirements = ({ password }) => {
  const validation = validatePassword(password);
  
  return (
    <div className="password-requirements">
      <p className="requirements-title">Password must include:</p>
      <div className="requirement">
        {validation.hasMinLength ? (
          <i className="fas fa-check valid"></i>
        ) : (
          <i className="fas fa-times-circle invalid"></i>
        )}
        <span>At least 6 characters</span>
      </div>
      <div className="requirement">
        {validation.hasUppercase ? (
          <i className="fas fa-check valid"></i>
        ) : (
          <i className="fas fa-times-circle invalid"></i>
        )}
        <span>One uppercase letter</span>
      </div>
      <div className="requirement">
        {validation.hasLowercase ? (
          <i className="fas fa-check valid"></i>
        ) : (
          <i className="fas fa-times-circle invalid"></i>
        )}
        <span>One lowercase letter</span>
      </div>
      <div className="requirement">
        {validation.hasNumber ? (
          <i className="fas fa-check valid"></i>
        ) : (
          <i className="fas fa-times-circle invalid"></i>
        )}
        <span>One number</span>
      </div>
      <div className="requirement">
        {validation.hasSpecialChar ? (
          <i className="fas fa-check valid"></i>
        ) : (
          <i className="fas fa-times-circle invalid"></i>
        )}
        <span>One special character</span>
      </div>
    </div>
  );
};
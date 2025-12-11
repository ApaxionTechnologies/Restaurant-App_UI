import { 
  FaCheck, 
  FaTimesCircle 
} from "react-icons/fa";
import '../styles/RegisterForm.css'
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

  const requirements = [
    { label: "At least 6 characters", valid: validation.hasMinLength },
    { label: "One uppercase letter", valid: validation.hasUppercase },
    { label: "One lowercase letter", valid: validation.hasLowercase },
    { label: "One number", valid: validation.hasNumber },
    { label: "One special character", valid: validation.hasSpecialChar },
  ];

  return (
    <div className="password-requirements">
   <ul className="password-requirements">
  {requirements.map((req, idx) => (
    <li
      key={idx}
      className={`requirement-item ${req.valid ? "valid" : "invalid"}`}
    >
      <span className="requirement-bullet"></span>
      {req.label}
    </li>
  ))}
</ul>


    </div>
  );
};
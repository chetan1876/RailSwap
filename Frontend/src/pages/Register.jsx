import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/auth.service";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/auth.css";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    const nameRegex = /^[A-Za-z ]{3,50}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    if (!nameRegex.test(formData.fullName)) {
      newErrors.fullName =
        "Name must contain only letters and spaces (3-50 chars)";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Please enter a valid email address";
    }

    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone =
        "Enter valid 10 digit Indian mobile number";
    }

    if (
      !passwordRegex.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number and special character";
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    if (!formData.terms) {
      newErrors.terms =
        "Please accept Terms & Conditions";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res =
        await authAPI.register({
          fullName:
            formData.fullName,
          email:
            formData.email,
          phoneNumber:
            formData.phone,
          password:
            formData.password,
        });

      /*
      Backend register response:
      {
        token,
        user
      }
      */

      const user =
        res.data.user;

      const token =
        res.data.token;

      if (
        user &&
        token
      ) {
        login(
          user,
          token
        );
      }

      navigate(
        "/dashboard"
      );
    } catch (err) {
      setErrors({
        general:
          err.response?.data
            ?.message ||
          "Registration failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-wrapper">

     
      {/* LEFT SIDE */}

      <div className="register-left">

        <h1>
          RailSwap
        </h1>

        <p>
          India's AI Powered Railway Passenger Assistance Platform.
        </p>

        <div className="feature-card">
          🚆 AI Powered Seat Exchange
        </div>

        <div className="feature-card">
          👨‍👩‍👧 Family Auto Linking
        </div>

        <div className="feature-card">
          📍 Smart Journey Companion
        </div>

        <div className="feature-card">
          🛡 Secure Authentication
        </div>

        <div className="feature-card">
          ⭐ Trusted Passenger Platform
        </div>

              <div className="register-info">

  <div className="info-box">
    <h2>50K+</h2>
    <p>Registered Passengers</p>
  </div>

  <div className="info-box">
    <h2>12K+</h2>
    <p>Successful Seat Swaps</p>
  </div>

  <div className="info-box">
    <h2>99.2%</h2>
    <p>Customer Satisfaction</p>
  </div>

</div>

<div className="register-security">
  🔒 Your information is protected with encrypted authentication and secure cloud storage.
</div>

      </div>



      {/* RIGHT SIDE */}

      <div className="auth-card">

        <h1>
          Create Account
        </h1>

        <p>
          Join RailSwap today —
          your smart railway companion.
        </p>

        {errors.general && (
          <div className="auth-error">
            {
              errors.general
            }
          </div>
        )}

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="form-group">
            <label>
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={
                formData.fullName
              }
              onChange={
                handleChange
              }
              placeholder="Enter full name"
            />

            {errors.fullName && (
              <div className="field-error">
                {
                  errors.fullName
                }
              </div>
            )}
          </div>

          <div className="form-group">
            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="Enter email"
            />

            {errors.email && (
              <div className="field-error">
                {
                  errors.email
                }
              </div>
            )}
          </div>

          <div className="form-group">
            <label>
              Mobile Number
            </label>

            <input
              type="tel"
              name="phone"
              value={
                formData.phone
              }
              onChange={
                handleChange
              }
              placeholder="Enter mobile number"
            />

            {errors.phone && (
              <div className="field-error">
                {
                  errors.phone
                }
              </div>
            )}
          </div>

          <div className="form-group">
            <label>
              Password
            </label>

            <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create strong password"
            />

            <span
              className="password-toggle"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>
          </div>

            {errors.password && (
              <div className="field-error">
                {
                  errors.password
                }
              </div>
            )}
          </div>

          <div className="password-wrapper">
  <input
    type={
      showConfirmPassword
        ? "text"
        : "password"
    }
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleChange}
    placeholder="Confirm password"
  />

  <span
    className="password-toggle"
    onClick={() =>
      setShowConfirmPassword(
        !showConfirmPassword
      )
    }
  >
    {showConfirmPassword ? (
      <FaEyeSlash />
    ) : (
      <FaEye />
    )}
  </span>
</div>

          <label className="terms">
            <input
              type="checkbox"
              name="terms"
              checked={
                formData.terms
              }
              onChange={
                handleChange
              }
            />

            I agree to Terms &
            Conditions
          </label>

          {errors.terms && (
            <div className="field-error">
              {
                errors.terms
              }
            </div>
          )}

          <button
            className="auth-btn"
            disabled={
              isLoading
            }
          >
            {isLoading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <p className="auth-footer">
          Already have an account?

          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Register;
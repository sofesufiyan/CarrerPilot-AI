import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

/**
 * Registration view component for CareerPilot AI.
 * Handles Email/Password account creation and validation checks.
 */
export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle Registration form submission.
   * 
   * @param {React.FormEvent} e 
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all registration fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signUp(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to create an account.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Google OAuth pop-up registration.
   */
  const handleGoogleSignUp = async () => {
    setError("");
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to sign up with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Header Block */}
        <div className="auth-header">
          <div className="auth-logo" aria-hidden="true">🚀</div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Sign up to get started with CareerPilot AI</p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="auth-error-box" role="alert" aria-live="assertive">
            <span className="auth-error-icon" aria-hidden="true">⚠️</span>
            <span className="auth-error-text">{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-input-group">
            <label htmlFor="signup-email" className="auth-input-label">
              Email Address
            </label>
            <input
              type="email"
              id="signup-email"
              className="auth-input-field"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="signup-password" className="auth-input-label">
              Password
            </label>
            <input
              type="password"
              id="signup-password"
              className="auth-input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="signup-confirm-password" className="auth-input-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="signup-confirm-password"
              className="auth-input-field"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Divider Grid */}
        <div className="auth-divider">
          <span className="auth-divider-line"></span>
          <span className="auth-divider-text">or continue with</span>
          <span className="auth-divider-line"></span>
        </div>

        {/* OAuth Buttons */}
        <button
          onClick={handleGoogleSignUp}
          className="auth-google-btn"
          disabled={loading}
          type="button"
          aria-label="Sign up with Google"
        >
          <span className="google-icon-wrapper" aria-hidden="true">
            <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.59c-.28 1.5-.12 3.01-.97 4.29l3.1 2.4c1.8-1.66 2.84-4.11 2.84-7.12z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.1-2.4c-.86.58-1.97.92-3.13.92-2.4 0-4.44-1.62-5.17-3.8l-3.2 2.48C4.54 22.01 8.01 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M6.83 15.81c-.18-.58-.29-1.2-.29-1.81s.1-1.23.29-1.81l-3.2-2.48C2.86 11.23 2.5 13.5 2.5 15s.36 3.77 1.13 5.29l3.2-2.48z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 8.01 0 4.54 1.99 2.5 5.29l3.2 2.48c.73-2.18 2.77-3.8 5.17-3.8z"
              />
            </svg>
          </span>
          Google
        </button>

        {/* Footer Actions */}
        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

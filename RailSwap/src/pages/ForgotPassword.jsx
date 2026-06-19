import "../styles/auth.css";

const ForgotPassword = () => {
  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      "Password reset link sent."
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>Forgot Password</h1>

        <p>
          Enter your registered
          email address.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter Email"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
          >
            Send Reset Link
          </button>

        </form>

      </div>
    </div>
  );
};

export default ForgotPassword;
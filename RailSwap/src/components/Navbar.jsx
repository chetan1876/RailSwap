import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          <i className="fa-solid fa-train"></i>
          RailSwap
        </Link>
      </div>

      <div className="navbar-search">
        <i className="fa-solid fa-magnifying-glass"></i>

        <input
          type="text"
          placeholder="Search features..."
        />
      </div>

      <div className="navbar-right">
        <button className="notification-btn">
          <i className="fa-regular fa-bell"></i>
        </button>

        {user ? (
          <div className="profile-dropdown">
            <button
              className="profile-btn"
              onClick={() =>
                setShowMenu(!showMenu)
              }
            >
              <img
                src="https://ui-avatars.com/api/?name=User"
                alt="profile"
              />

              <span>
                {user?.name || "User"}
              </span>

              <i className="fa-solid fa-chevron-down"></i>
            </button>

            {showMenu && (
              <div className="dropdown-menu">
                <Link to="/profile">
                  Profile
                </Link>

                <Link to="/settings">
                  Settings
                </Link>

                <button onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <Link
              className="login-btn"
              to="/login"
            >
              Login
            </Link>

            <Link
              className="register-btn"
              to="/register"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
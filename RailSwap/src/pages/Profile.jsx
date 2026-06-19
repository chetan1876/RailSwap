import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>
          Manage your account information and profile details.
        </p>
      </div>

      <div className="profile-container">

        {/* Left Section */}
        <div className="profile-card">

          <div className="profile-top">
            <img
              src={`https://ui-avatars.com/api/?name=${
                user?.name || "RailSwap User"
              }&background=2563EB&color=fff&size=128`}
              alt="Profile"
            />

            <div>
              <h2>{user?.name || "RailSwap User"}</h2>
              <p>Verified Passenger</p>
            </div>
          </div>

          <div className="profile-details">

            <div className="detail-box">
              <span>Full Name</span>
              <h4>{user?.name || "RailSwap User"}</h4>
            </div>

            <div className="detail-box">
              <span>Email Address</span>
              <h4>{user?.email || "railswap@gmail.com"}</h4>
            </div>

            <div className="detail-box">
              <span>Mobile Number</span>
              <h4>{user?.phone || "+91 9876543210"}</h4>
            </div>

          </div>

          <button className="primary-action-btn">
            Edit Profile
          </button>

        </div>

        {/* Right Section */}
        <div className="trust-score-card">

          <h3>Trust Score</h3>

          <div className="score-circle">
            92
          </div>

          <p>
            Excellent passenger trust rating based on successful
            journey interactions and verified exchanges.
          </p>

          <div className="trust-info">

            <div>
              <strong>15+</strong>
              <span>Trips</span>
            </div>

            <div>
              <strong>98%</strong>
              <span>Positive</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
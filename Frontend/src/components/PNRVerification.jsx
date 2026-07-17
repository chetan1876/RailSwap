import { useState } from "react";
import "../styles/pnrVerification.css";

const PNRVerification = () => {
  const [pnr, setPnr] = useState("");

  return (
    <div className="pnr-container">

      {/* Header */}

      <div className="page-header">
        <h1>PNR Verification</h1>
        <p>Verify passenger journey details instantly.</p>
      </div>

      {/* Search Card */}

      <div className="pnr-card">

        <div className="pnr-title">

          <div>
            <h2>Enter PNR Number</h2>
            <p>Check ticket status and passenger details</p>
          </div>

          <div className="train-icon">
            🚆
          </div>

        </div>

        <div className="search-box">

          <input
            type="text"
            placeholder="Enter 10 Digit PNR"
            value={pnr}
            maxLength={10}
            onChange={(e) => setPnr(e.target.value)}
          />

          <button>
            Verify PNR
          </button>

        </div>

      </div>

      {/* Recently Verified */}

      <div className="recent-section">

        <div className="recent-header">

          <h2>Recently Verified PNRs</h2>

          <span>Last 3 Searches</span>

        </div>

        <div className="recent-list">

          <div className="recent-card">

            <div className="recent-left">

              <h3>8425639178</h3>

              <p>Rajdhani Express</p>

              <small>New Delhi → Patna</small>

            </div>

            <div className="recent-right">

              <span className="status confirmed">
                Confirmed
              </span>

              <small>2 min ago</small>

            </div>

          </div>

          <div className="recent-card">

            <div className="recent-left">

              <h3>6452178934</h3>

              <p>Vande Bharat Express</p>

              <small>Lucknow → Delhi</small>

            </div>

            <div className="recent-right">

              <span className="status waiting">
                WL 12
              </span>

              <small>8 min ago</small>

            </div>

          </div>

          <div className="recent-card">

            <div className="recent-left">

              <h3>9854123678</h3>

              <p>Shatabdi Express</p>

              <small>Kanpur → Delhi</small>

            </div>

            <div className="recent-right">

              <span className="status rac">
                RAC 4
              </span>

              <small>15 min ago</small>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PNRVerification;
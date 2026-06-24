import { useState } from "react";
import {
  FaTrain,
  FaCircleCheck,
  FaUser,
  FaTicket,
  FaLocationDot,
} from "react-icons/fa6";

import "../styles/pnrVerification.css";

const PNRVerification = () => {
  const [pnr, setPnr] = useState("");
  const [data, setData] = useState(null);

  const verifyPNR = () => {
    if (pnr.length < 10) {
      alert("Enter a valid 10 digit PNR");
      return;
    }

    setData({
      passenger: "Chetan Kumar",
      train: "12345 Rajdhani Express",
      coach: "B2",
      seat: "35",
      status: "Confirmed",
      boarding: "New Delhi",
      destination: "Kolkata",
    });
  };

  return (
    <div className="pnr-page">
      <div className="pnr-header">
        <h1>PNR Verification</h1>
        <p>Verify passenger journey details instantly.</p>
      </div>

      <div className="pnr-card">
        <div className="card-top">
          <div>
            <h3>Enter PNR Number</h3>
            <p>Check ticket status and passenger details</p>
          </div>

          <div className="pnr-icon">
            <FaTrain />
          </div>
        </div>

        <div className="pnr-form">
          <input
            type="text"
            maxLength="10"
            placeholder="Enter 10 Digit PNR"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
          />

          <button onClick={verifyPNR}>
            Verify PNR
          </button>
        </div>
      </div>

      {data && (
        <div className="result-card">
          <div className="result-header">
            <div>
              <h2>Journey Details</h2>
              <p>Passenger verification successful</p>
            </div>

            <div className="status-badge">
              <FaCircleCheck />
              <span>{data.status}</span>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <span>
                <FaUser /> Passenger
              </span>
              <h4>{data.passenger}</h4>
            </div>

            <div className="detail-item">
              <span>
                <FaTrain /> Train
              </span>
              <h4>{data.train}</h4>
            </div>

            <div className="detail-item">
              <span>
                <FaTicket /> Coach
              </span>
              <h4>{data.coach}</h4>
            </div>

            <div className="detail-item">
              <span>
                <FaTicket /> Seat
              </span>
              <h4>{data.seat}</h4>
            </div>

            <div className="detail-item">
              <span>
                <FaLocationDot /> Boarding
              </span>
              <h4>{data.boarding}</h4>
            </div>

            <div className="detail-item">
              <span>
                <FaLocationDot /> Destination
              </span>
              <h4>{data.destination}</h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PNRVerification;
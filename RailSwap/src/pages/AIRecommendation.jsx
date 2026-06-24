import { useState } from "react";
import {
  FaRobot,
  FaUser,
  FaTrain,
  FaStar,
  FaCouch,
  FaCircleCheck,
} from "react-icons/fa6";

import "../styles/aiRecommendation.css";

const AIRecommendation = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);

  const recommendations = [
    {
      id: 1,
      seat: "B2 - 35",
      type: "Lower Berth",
      score: 98,
      reason: "Best match for age and comfort",
    },
    {
      id: 2,
      seat: "B1 - 21",
      type: "Window Seat",
      score: 95,
      reason: "Less crowded coach",
    },
    {
      id: 3,
      seat: "B3 - 12",
      type: "Lower Berth",
      score: 92,
      reason: "Near family passengers",
    },
  ];

  return (
    <div className="ai-page">

      <div className="page-header">
        <h1>AI Seat Recommendation</h1>
        <p>
          Smart AI powered recommendations based on
          passenger comfort, age and travel preferences.
        </p>
      </div>

      <div className="ai-top-grid">

        <div className="profile-card">

          <div className="card-title">
            <FaUser />
            <h3>Passenger Profile</h3>
          </div>

          <div className="info-row">
            <span>Name</span>
            <strong>Chetan Kumar</strong>
          </div>

          <div className="info-row">
            <span>Age</span>
            <strong>20 Years</strong>
          </div>

          <div className="info-row">
            <span>Current Seat</span>
            <strong>B4 - 48</strong>
          </div>

          <div className="info-row">
            <span>Preference</span>
            <strong>Lower Berth</strong>
          </div>

        </div>

        <div className="analytics-card">

          <div className="analytics-box">
            <FaStar />
            <h2>98%</h2>
            <p>Best Match</p>
          </div>

          <div className="analytics-box">
            <FaCouch />
            <h2>12</h2>
            <p>Available Options</p>
          </div>

          <div className="analytics-box">
            <FaCircleCheck />
            <h2>95%</h2>
            <p>Success Rate</p>
          </div>

        </div>

      </div>

      <div className="recommendation-section">

        <h2>Recommended Seats</h2>

        {recommendations.map((item) => (

          <div
            className={`recommend-card ${
              selectedSeat === item.id
                ? "active-card"
                : ""
            }`}
            key={item.id}
          >

            <div className="seat-info">

              <div className="seat-avatar">
                <FaTrain />
              </div>

              <div>
                <h3>{item.seat}</h3>
                <p>{item.type}</p>
              </div>

            </div>

            <div className="score-badge">
              {item.score}%
            </div>

            <div className="reason">
              {item.reason}
            </div>

            <button
              onClick={() =>
                setSelectedSeat(item.id)
              }
            >
              Select Seat
            </button>

          </div>

        ))}

      </div>

      <div className="final-card">

        <div className="card-title">
          <FaRobot />
          <h3>AI Suggestion</h3>
        </div>

        <p>
          Based on your profile and travel
          preferences, AI recommends
          <strong> B2 - 35 Lower Berth </strong>
          as the most comfortable and suitable seat.
        </p>

      </div>

    </div>
  );
};

export default AIRecommendation;
import React from "react";
import "../styles/aiRecommendation.css";

const recommendations = [
  {
    id: 1,
    passenger: "Ravi Kumar",
    currentSeat: "B1-45 (Upper)",
    suggestedSeat: "B1-23 (Lower)",
    match: "98%",
    reason: "Senior Citizen Priority",
  },
  {
    id: 2,
    passenger: "Priya Singh",
    currentSeat: "S5-62",
    suggestedSeat: "S5-34",
    match: "95%",
    reason: "Women Safety Match",
  },
  {
    id: 3,
    passenger: "Family Group",
    currentSeat: "B2-12, 13",
    suggestedSeat: "B2-15, 16",
    match: "92%",
    reason: "Family Seating",
  },
];

function AIRecommendation() {
  return (
    <div className="ai-page">
      <div className="page-header">
        <h1>AI Seat Recommendation</h1>
        <p>
          Smart AI suggests the best seat exchanges based on comfort, safety,
          family grouping and passenger preferences.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>24</h3>
          <p>Available Matches</p>
        </div>

        <div className="stat-card">
          <h3>92%</h3>
          <p>Success Rate</p>
        </div>

        <div className="stat-card">
          <h3>15+</h3>
          <p>Recommended Swaps</p>
        </div>
      </div>

      <div className="recommendation-card">
        <h2>Top AI Recommendations</h2>

        <table>
          <thead>
            <tr>
              <th>Passenger</th>
              <th>Current Seat</th>
              <th>Suggested Seat</th>
              <th>Match Score</th>
              <th>Reason</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {recommendations.map((item) => (
              <tr key={item.id}>
                <td>{item.passenger}</td>
                <td>{item.currentSeat}</td>
                <td>{item.suggestedSeat}</td>
                <td>{item.match}</td>
                <td>{item.reason}</td>

                <td>
                  <button className="accept-btn">Request Swap</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AIRecommendation;

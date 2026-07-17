import { useState } from "react";
import "../styles/womenSafety.css";

const WomenSafety = () => {
  const [safetyScore] = useState(96);

  const companions = [
    {
      name: "Priya Sharma",
      age: 24,
      verified: true,
      match: "98%",
    },
    {
      name: "Anjali Singh",
      age: 22,
      verified: true,
      match: "94%",
    },
    {
      name: "Neha Verma",
      age: 26,
      verified: true,
      match: "91%",
    },
  ];

  return (
    <div className="women-page">
      <div className="women-header">
        <h1>Women Safety Matching</h1>

        <p>
          AI powered women safety assistance, verified companion matching and
          safe seat recommendations.
        </p>
      </div>

      <div className="women-top-grid">
        <div className="safety-score-card">
          <h3>Safety Score</h3>

          <div className="score-circle">{safetyScore}</div>

          <p>Excellent Safety Zone</p>
        </div>

        <div className="safety-stats">
          <div className="stat-card">
            <div className="stat-icon traveler-icon">👩</div>

            <h2>120+</h2>

            <p>Verified Travelers</p>

            <span className="live-tag">● 85 Active Now</span>

            <div className="progress-bar">
              <div
                className="progress-fill pink-fill"
                style={{ width: "82%" }}
              ></div>
            </div>

          </div>

          <div className="stat-card">
            <div className="stat-icon monitor-icon">🛡️</div>

            <h2>24×7</h2>

            <p>Monitoring</p>

            <span className="live-tag success">● AI Active</span>

            <div className="progress-bar">
              <div
                className="progress-fill green-fill"
                style={{ width: "100%" }}
              ></div>
            </div>

          
          </div>

          <div className="stat-card">
            <div className="stat-icon accuracy-icon">🎯</div>

            <h2>98%</h2>

            <p>Safety Accuracy</p>

            <span className="live-tag blue">● Verified</span>

            <div className="progress-bar">
              <div
                className="progress-fill blue-fill"
                style={{ width: "98%" }}
              ></div>
            </div>

            
          </div>

          <div className="stat-card">
            <h2>24x7</h2>
            <p>Monitoring</p>
          </div>

          <div className="stat-card">
            <h2>98%</h2>
            <p>Safety Accuracy</p>
          </div>
        </div>
      </div>

      <div className="seat-card">
        <h2>AI Safe Seat Suggestions</h2>

        <div className="seat-grid">
          <div className="safe-seat">
            <div className="seat-top">
              <h3>B2-21</h3>
              <span className="safe-badge">Safe</span>
            </div>
            <p>98% Match</p>
          </div>

          <div className="safe-seat">
            <div className="seat-top">
              <h3>B2-24</h3>
              <span className="safe-badge">Best</span>
            </div>
            <p>97% Match</p>
          </div>

          <div className="safe-seat">
            <div className="seat-top">
              <h3>B1-18</h3>
              <span className="safe-badge">Safe</span>
            </div>
            <p>96% Match</p>
          </div>

          <div className="safe-seat">
            <div className="seat-top">
              <h3>B3-12</h3>
              <span className="safe-badge">Best</span>
            </div>
            <p>99% Match</p>
          </div>
        </div>
      </div>

      <div className="companion-section">
        <h2>Verified Women Travelers</h2>

        {companions.map((person, index) => (
          <div key={index} className="companion-card">
            <div>
              <h3>{person.name}</h3>
              <p>Age: {person.age}</p>
            </div>

            <div className="verified-badge">Verified</div>

            <div className="match-badge">{person.match}</div>

            <button>Connect</button>
          </div>
        ))}
      </div>

      <div className="emergency-card">
        <h2>Emergency Assistance</h2>

        <div className="emergency-buttons">
          <button className="sos-btn">🚨 SOS Alert</button>

          <button className="help-btn">👮 Contact RPF</button>

          <button className="help-btn">📞 Helpline</button>
        </div>
      </div>

      <div className="ai-card">
        <h3>AI Safety Insight</h3>

        <p>
          Coach B2 currently has the highest women traveler density and lowest
          safety risk score. Recommended for seat exchange requests.
        </p>
      </div>
    </div>
  );
};

export default WomenSafety;

import { useState } from "react";
import "../styles/crowdDensity.css";

const CrowdDensity = () => {
  const [selectedStation, setSelectedStation] = useState("New Delhi");

  const platforms = [
    {
      platform: "Platform 1",
      crowd: "Low",
      percentage: 25,
      color: "low",
    },
    {
      platform: "Platform 2",
      crowd: "Medium",
      percentage: 58,
      color: "medium",
    },
    {
      platform: "Platform 3",
      crowd: "High",
      percentage: 88,
      color: "high",
    },
    {
      platform: "Platform 4",
      crowd: "Low",
      percentage: 30,
      color: "low",
    },
  ];

  return (
    <div className="crowd-page">
      <div className="crowd-header">
        <div>
          <h1>🚉 AI Crowd Command Center</h1>

          <p>
            Real-time crowd monitoring, prediction and passenger flow
            optimization.
          </p>
        </div>

        <div className="live-badge">🔴 Live Monitoring</div>
      </div>

      <div className="alert-card">
        <h2>🚨 Live Crowd Alert</h2>

        <p>
          Platform 3 is approaching maximum capacity. AI recommends redirecting
          passengers.
        </p>
      </div>

      <div className="crowd-top">
        <div className="station-card">
          <h3>Select Station</h3>

          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
          >
            <option>New Delhi</option>
            <option>Mumbai Central</option>
            <option>Howrah</option>
            <option>Chennai Central</option>
          </select>

          <div className="station-status">
            <h4>Station Status</h4>
            <p>
              Select a station to monitor live crowd updates and AI predictions.
            </p>
            
          </div>
        </div>

        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon">👥</div>

            <h2>72%</h2>

            <p>Current Crowd</p>

            <span className="summary-badge">● Live</span>

            <div className="summary-progress">
              <div className="summary-fill" style={{ width: "72%" }}></div>
            </div>

            <small>+8% Last Hour</small>
          </div>

          <div className="summary-card">
            <div className="summary-icon">⚠️</div>

            <h2>High</h2>

            <p>Risk Level</p>

            <span className="summary-badge warning">Peak Time</span>

            <div className="summary-progress">
              <div
                className="summary-fill warning-fill"
                style={{ width: "88%" }}
              ></div>
            </div>

            <small>Platform 3 Busy</small>
          </div>

          <div className="summary-card">
            <div className="summary-icon">🚉</div>

            <h2>14K</h2>

            <p>Passengers</p>

            <span className="summary-badge info">Updated</span>

            <div className="summary-progress">
              <div
                className="summary-fill info-fill"
                style={{ width: "90%" }}
              ></div>
            </div>

            <small>Today</small>
          </div>

          <div className="station-extra"></div>
        </div>
      </div>

      <div className="ai-score-card">
        <h2>🧠 AI Crowd Risk Score</h2>

        <div className="ai-score">92%</div>

        <p>Heavy congestion expected within next 45 minutes.</p>
      </div>

      <div className="platform-section">
        <h2>📊 Platform Analytics</h2>

        {platforms.map((item, index) => (
          <div key={index} className="platform-card">
            <div>
              <h3>{item.platform}</h3>
              <p>{item.crowd} Crowd</p>
            </div>

            <div className="progress-container">
              <div
                className={`progress-bar ${item.color}`}
                style={{
                  width: item.percentage + "%",
                }}
              ></div>
            </div>

            <span>{item.percentage}%</span>
          </div>
        ))}
      </div>

      <div className="weather-card">
        <h2>🌦 Weather Impact</h2>

        <div className="weather-info">
          <h3>32°C</h3>
          <p>Clear Sky</p>
        </div>

        <span>Crowd expected +12% due to weather.</span>
      </div>

      <div className="train-impact-card">
        <h2>🚆 Upcoming Train Impact</h2>

        <div className="train-row">
          <span>Rajdhani Express</span>
          <span>+1800</span>
        </div>

        <div className="train-row">
          <span>Vande Bharat</span>
          <span>+950</span>
        </div>
      </div>

      <div className="distribution-card">
        <h2>👥 Passenger Distribution</h2>

        <div className="distribution-grid">
          <div className="dist-card">
            Waiting Hall
            <strong>42%</strong>
          </div>

          <div className="dist-card">
            Platforms
            <strong>38%</strong>
          </div>

          <div className="dist-card">
            Food Court
            <strong>12%</strong>
          </div>

          <div className="dist-card">
            Exit Area
            <strong>8%</strong>
          </div>
        </div>
      </div>

      <div className="zone-section">
        <h2>🔥 Crowd Heat Zones</h2>

        <div className="zone-grid">
          <div className="zone green">Zone A</div>

          <div className="zone yellow">Zone B</div>

          <div className="zone red">Zone C</div>

          <div className="zone green">Zone D</div>
        </div>
      </div>

      <div className="timeline-card">
        <h2>⏳ Next 3 Hour Prediction</h2>

        <div className="timeline-row">1 PM → 72%</div>

        <div className="timeline-row">2 PM → 81%</div>

        <div className="timeline-row">3 PM → 90%</div>
      </div>

      <div className="cctv-card">
        <h2>📹 CCTV Crowd Monitoring</h2>

        <p>AI detected unusual crowd growth near Platform 3.</p>

        <button>View Snapshot</button>
      </div>

      <div className="smart-actions">
        <h2>⚡ AI Smart Actions</h2>

        <div className="action-grid">
          <button>Redirect Passengers</button>
          <button>Open Extra Gate</button>
          <button>Deploy Staff</button>
          <button>Send Alert</button>
        </div>
      </div>

      <div className="ai-insight">
        <h3>🤖 AI Recommendation</h3>

        <p>
          Platform 3 is expected to reach maximum occupancy within the next 45
          minutes. Use Platform 1 or Platform 4 for smoother movement.
        </p>
      </div>
    </div>
  );
};

export default CrowdDensity;

import { useState } from "react";
import "../styles/crowdDensity.css";

const CrowdDensity = () => {
  const [selectedStation, setSelectedStation] =
    useState("New Delhi");

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
        <h1>Crowd Density Prediction</h1>

        <p>
          Real-time crowd monitoring and AI
          prediction for railway stations.
        </p>
      </div>

      <div className="crowd-top">

        <div className="station-card">

          <h3>Select Station</h3>

          <select
            value={selectedStation}
            onChange={(e) =>
              setSelectedStation(
                e.target.value
              )
            }
          >
            <option>New Delhi</option>
            <option>Mumbai Central</option>
            <option>Howrah</option>
            <option>Chennai Central</option>
          </select>

        </div>

        <div className="summary-grid">

          <div className="summary-card">
            <h2>72%</h2>
            <p>Current Crowd</p>
          </div>

          <div className="summary-card">
            <h2>High</h2>
            <p>Risk Level</p>
          </div>

          <div className="summary-card">
            <h2>14K</h2>
            <p>Passengers</p>
          </div>

        </div>

      </div>

      <div className="platform-section">

        <h2>Platform Analytics</h2>

        {platforms.map((item, index) => (

          <div
            key={index}
            className="platform-card"
          >

            <div>
              <h3>{item.platform}</h3>
              <p>{item.crowd} Crowd</p>
            </div>

            <div className="progress-container">

              <div
                className={`progress-bar ${item.color}`}
                style={{
                  width:
                    item.percentage + "%",
                }}
              ></div>

            </div>

            <span>
              {item.percentage}%
            </span>

          </div>

        ))}

      </div>

      <div className="heatmap-card">

        <h2>AI Crowd Forecast</h2>

        <div className="heatmap-grid">

          <div className="heat low">
            Morning
          </div>

          <div className="heat medium">
            Afternoon
          </div>

          <div className="heat high">
            Evening
          </div>

          <div className="heat medium">
            Night
          </div>

        </div>

      </div>

      <div className="ai-insight">

        <h3>AI Recommendation</h3>

        <p>
          Platform 3 is expected to reach
          maximum occupancy within the next
          45 minutes. Consider using
          Platform 1 or Platform 4 for
          easier movement and seat exchange.
        </p>

      </div>

    </div>
  );
};

export default CrowdDensity;
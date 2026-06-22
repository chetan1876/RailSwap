import { useState } from "react";
import "../styles/coachHeatmap.css";

const CoachHeatmap = () => {
  const [selectedCoach, setSelectedCoach] = useState("B2");

  const seats = [
    "available","available","occupied","occupied",
    "medium","available","occupied","medium",
    "available","available","occupied","occupied",
    "medium","available","occupied","available",
    "available","medium","occupied","available",
    "occupied","medium","available","available",
    "occupied","occupied","available","medium",
    "available","occupied","available","available",
  ];

  return (
    <div className="heatmap-page">

      <div className="page-header">
        <h1>Coach Heatmap</h1>

        <p>
          Visual representation of seat occupancy
          and crowd density inside coach.
        </p>
      </div>

      <div className="coach-top">

        <div className="coach-selector-card">

          <h3>Select Coach</h3>

          <select
            value={selectedCoach}
            onChange={(e) =>
              setSelectedCoach(e.target.value)
            }
          >
            <option>B1</option>
            <option>B2</option>
            <option>B3</option>
            <option>S1</option>
            <option>S2</option>
          </select>

        </div>

        <div className="heatmap-stats">

          <div className="stat-card">
            <h2>14</h2>
            <p>Available</p>
          </div>

          <div className="stat-card">
            <h2>10</h2>
            <p>Occupied</p>
          </div>

          <div className="stat-card">
            <h2>8</h2>
            <p>Medium</p>
          </div>

        </div>

      </div>

      <div className="legend">

        <div>
          <span className="green"></span>
          Available
        </div>

        <div>
          <span className="yellow"></span>
          Medium
        </div>

        <div>
          <span className="red"></span>
          Occupied
        </div>

      </div>

      <div className="coach-grid">

        {seats.map((seat, index) => (
          <div
            key={index}
            className={`seat ${seat}`}
          >
            {index + 1}
          </div>
        ))}

      </div>

      <div className="ai-card">

        <h3>AI Insight</h3>

        <p>
          Coach {selectedCoach} is currently
          operating at 72% occupancy.
          Recommended coach for seat exchange:
          <strong> B1 </strong>
          due to lower crowd density.
        </p>

      </div>

    </div>
  );
};

export default CoachHeatmap;
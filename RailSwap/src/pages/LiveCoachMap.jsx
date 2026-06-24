import { useState } from "react";
import "../styles/liveCoachMap.css";

const LiveCoachMap = () => {
  const [selectedCoach, setSelectedCoach] = useState("B2");

  const seats = [
    { no: "1", type: "occupied" },
    { no: "2", type: "available" },
    { no: "3", type: "occupied" },
    { no: "4", type: "available" },
    { no: "5", type: "user" },
    { no: "6", type: "available" },
    { no: "7", type: "occupied" },
    { no: "8", type: "available" },
    { no: "9", type: "available" },
    { no: "10", type: "occupied" },
    { no: "11", type: "available" },
    { no: "12", type: "occupied" },
    { no: "13", type: "available" },
    { no: "14", type: "available" },
    { no: "15", type: "occupied" },
    { no: "16", type: "available" },
  ];

  return (
    <div className="live-coach-page">

      <div className="live-header">
        <div>
          <h1>Live Coach Map</h1>
          <p>
            View real-time coach layout,
            occupancy and your current seat.
          </p>
        </div>

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

      <div className="coach-stats">

        <div className="coach-stat-card">
          <h2>72%</h2>
          <p>Occupancy</p>
        </div>

        <div className="coach-stat-card">
          <h2>28</h2>
          <p>Available Seats</p>
        </div>

        <div className="coach-stat-card">
          <h2>B2</h2>
          <p>Current Coach</p>
        </div>

      </div>

      <div className="legend">

        <div>
          <span className="available-box"></span>
          Available
        </div>

        <div>
          <span className="occupied-box"></span>
          Occupied
        </div>

        <div>
          <span className="user-box"></span>
          Your Seat
        </div>

      </div>

      <div className="coach-container">

        <div className="coach-title">
          Coach {selectedCoach}
        </div>

        <div className="coach-grid">

          {seats.map((seat) => (
            <div
              key={seat.no}
              className={`seat-box ${seat.type}`}
            >
              {seat.no}
            </div>
          ))}

        </div>

      </div>

      <div className="coach-info-card">

        <h3>AI Coach Insight</h3>

        <p>
          Coach B2 currently has medium crowd
          density. Available lower berths:
          <strong> 12, 18, 24</strong>.
          Recommended coach for seat exchange:
          <strong> B1</strong>.
        </p>

      </div>

    </div>
  );
};

export default LiveCoachMap;
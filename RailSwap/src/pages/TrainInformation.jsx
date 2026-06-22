import { useState } from "react";
import "../styles/trainInformation.css";

const TrainInformation = () => {
  const [trainNo, setTrainNo] = useState("12345");

  const stations = [
    {
      station: "New Delhi",
      arrival: "--",
      departure: "16:00",
      status: "Departed",
    },
    {
      station: "Kanpur",
      arrival: "20:30",
      departure: "20:35",
      status: "On Time",
    },
    {
      station: "Prayagraj",
      arrival: "22:45",
      departure: "22:50",
      status: "On Time",
    },
    {
      station: "Kolkata",
      arrival: "08:00",
      departure: "--",
      status: "Destination",
    },
  ];

  return (
    <div className="train-info-page">

      <div className="train-header">
        <h1>Train Information</h1>
        <p>
          View train route, timing,
          running status and station details.
        </p>
      </div>

      <div className="search-card">

        <input
          type="text"
          value={trainNo}
          onChange={(e) =>
            setTrainNo(e.target.value)
          }
          placeholder="Enter Train Number"
        />

        <button>
          Search Train
        </button>

      </div>

      <div className="train-overview">

        <div className="overview-card">
          <h2>12345</h2>
          <p>Rajdhani Express</p>
        </div>

        <div className="overview-card">
          <h2>Running</h2>
          <p>Current Status</p>
        </div>

        <div className="overview-card">
          <h2>95%</h2>
          <p>On Time Rate</p>
        </div>

        <div className="overview-card">
          <h2>12h</h2>
          <p>Journey Duration</p>
        </div>

      </div>

      <div className="route-card">

        <h2>Route Timeline</h2>

        <div className="station-table">

          {stations.map((item, index) => (

            <div
              key={index}
              className="station-row"
            >

              <div>
                <strong>
                  {item.station}
                </strong>
              </div>

              <div>
                Arr: {item.arrival}
              </div>

              <div>
                Dep: {item.departure}
              </div>

              <div className="status">
                {item.status}
              </div>

            </div>

          ))}

        </div>

      </div>

      <div className="insight-card">

        <h3>AI Prediction</h3>

        <p>
          Train is currently running
          on schedule with low delay risk.
          Estimated arrival at destination:
          <strong> 08:00 AM</strong>.
        </p>

      </div>

    </div>
  );
};

export default TrainInformation;
import { useState } from "react";
import "../styles/stationNavigator.css";

const StationNavigator = () => {
  const [destination, setDestination] =
    useState("Platform 5");

  const locations = [
    {
      name: "Platform 1",
      distance: "120m",
      icon: "fa-train",
    },
    {
      name: "Platform 5",
      distance: "250m",
      icon: "fa-train-subway",
    },
    {
      name: "Waiting Hall",
      distance: "80m",
      icon: "fa-chair",
    },
    {
      name: "Food Court",
      distance: "150m",
      icon: "fa-utensils",
    },
    {
      name: "Exit Gate",
      distance: "300m",
      icon: "fa-right-from-bracket",
    },
    {
      name: "Medical Room",
      distance: "90m",
      icon: "fa-kit-medical",
    },
  ];

  return (
    <div className="navigator-page">

      <div className="navigator-header">
        <h1>Station Navigator</h1>

        <p>
          Find platforms, exits, waiting
          halls and station facilities instantly.
        </p>
      </div>

      <div className="search-card">

        <input
          type="text"
          placeholder="Search location..."
          value={destination}
          onChange={(e) =>
            setDestination(e.target.value)
          }
        />

        <button>
          Navigate
        </button>

      </div>

      <div className="station-map-card">

        <div className="map-header">
          <h2>Station Layout</h2>

          <span>
            Current Location: Main Entrance
          </span>
        </div>

        <div className="map-grid">

          <div className="map-box entrance">
            Entrance
          </div>

          <div className="map-box waiting">
            Waiting Hall
          </div>

          <div className="map-box food">
            Food Court
          </div>

          <div className="map-box platform">
            Platform 1
          </div>

          <div className="map-box platform">
            Platform 2
          </div>

          <div className="map-box platform">
            Platform 3
          </div>

          <div className="map-box platform">
            Platform 4
          </div>

          <div className="map-box active-platform">
            Platform 5
          </div>

        </div>

      </div>

      <div className="location-grid">

        {locations.map((item, index) => (

          <div
            className="location-card"
            key={index}
          >

            <i
              className={`fa-solid ${item.icon}`}
            ></i>

            <h3>{item.name}</h3>

            <p>{item.distance}</p>

            <button>
              Open Route
            </button>

          </div>

        ))}

      </div>

      <div className="navigator-ai-card">

        <h3>AI Navigation Insight</h3>

        <p>
          Fastest route to Platform 5:
          Main Entrance →
          Waiting Hall →
          Platform 5.
          Estimated walking time:
          <strong> 3 Minutes</strong>.
        </p>

      </div>

    </div>
  );
};

export default StationNavigator;
import { useState } from "react";
import {
  FaUsers,
  FaUserGroup,
  FaHandshake,
  FaStar,
  FaRobot,
  FaLocationDot,
} from "react-icons/fa6";

import "../styles/journeyCompanion.css";

const JourneyCompanion = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const companions = [
    {
      id: 1,
      name: "Rahul Kumar",
      age: 22,
      match: 96,
      seat: "B2-34",
      interest: "Technology",
    },
    {
      id: 2,
      name: "Amit Singh",
      age: 24,
      match: 92,
      seat: "B2-40",
      interest: "Sports",
    },
    {
      id: 3,
      name: "Priya Sharma",
      age: 21,
      match: 89,
      seat: "B3-18",
      interest: "Travel",
    },
  ];

  return (
    <div className="journey-page">

      <div className="page-header">
        <h1>Journey Companion Match</h1>
        <p>
          Find compatible co-travelers based on
          interests, age and journey preferences.
        </p>
      </div>

      <div className="stats-row">

        <div className="stat-card">
          <FaUsers />
          <h2>18</h2>
          <p>Available Matches</p>
        </div>

        <div className="stat-card">
          <FaStar />
          <h2>96%</h2>
          <p>Best Match</p>
        </div>

        <div className="stat-card">
          <FaHandshake />
          <h2>84%</h2>
          <p>Connection Rate</p>
        </div>

      </div>

      <div className="companion-list">

        {companions.map((person) => (

          <div
            key={person.id}
            className={`companion-card ${
              selectedUser === person.id
                ? "active-card"
                : ""
            }`}
          >

            <div className="avatar">
              {person.name.charAt(0)}
            </div>

            <div className="companion-info">

              <h3>{person.name}</h3>

              <div className="info-tags">
                <span>Age: {person.age}</span>
                <span>
                  <FaLocationDot />
                  {person.seat}
                </span>
              </div>

              <p>Interest: {person.interest}</p>

            </div>

            <div className="match-score">
              {person.match}% Match
            </div>

            <button
              className="connect-btn"
              onClick={() =>
                setSelectedUser(person.id)
              }
            >
              Connect
            </button>

          </div>

        ))}

      </div>

      <div className="suggestion-card">

        <div className="suggestion-header">
          <FaRobot />
          <h3>AI Suggestion</h3>
        </div>

        <p>
          Rahul Kumar is your most compatible
          journey companion with a
          <strong> 96% match score</strong>.
          Shared interests and nearby seating
          make this an excellent match.
        </p>

      </div>

    </div>
  );
};

export default JourneyCompanion;
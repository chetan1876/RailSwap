import { useState } from "react";
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
          <h2>18</h2>
          <p>Available Matches</p>
        </div>

        <div className="stat-card">
          <h2>96%</h2>
          <p>Best Match</p>
        </div>

        <div className="stat-card">
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

              <p>Age: {person.age}</p>

              <p>Seat: {person.seat}</p>

              <p>Interest: {person.interest}</p>
            </div>

            <div className="match-score">
              {person.match}%
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

        <h3>AI Suggestion</h3>

        <p>
          Rahul Kumar is your most compatible
          journey companion with a 96% match score.
        </p>

      </div>

    </div>
  );
};

export default JourneyCompanion;
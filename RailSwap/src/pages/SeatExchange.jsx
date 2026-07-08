import "../styles/seatExchange.css";

const SeatExchange = () => {
  const requests = [
    {
      id: 1,
      name: "Rahul Kumar",
      age: 27,
      gender: "Male",
      coach: "B2",
      currentSeat: "42",
      preferred: "Lower Berth",
      station: "Lucknow",
      journey: "Delhi → Patna",
      match: 96,
    },
    {
      id: 2,
      name: "Amit Singh",
      age: 31,
      gender: "Male",
      coach: "B3",
      currentSeat: "28",
      preferred: "Window Seat",
      station: "Kanpur",
      journey: "Delhi → Varanasi",
      match: 89,
    },
  ];

  return (
    <div className="seat-container">

      {/* Header */}

      <div className="page-header">

        <h1>🚆 Seat Exchange</h1>

        <p>
          Find compatible passengers and exchange your seat with ease.
        </p>

      </div>

      {/* Statistics */}

      <div className="stats">

        <div className="card">
          <h2>24</h2>
          <span>Active Requests</span>
        </div>

        <div className="card">
          <h2>92%</h2>
          <span>Success Rate</span>
        </div>

        <div className="card">
          <h2>156</h2>
          <span>Total Exchanges</span>
        </div>

      </div>

      {/* Seat Information */}

      <div className="top-section">

        <div className="seat-card">

          <h2>Your Current Seat</h2>

          <h1>B2 - 35</h1>

          <p>Middle Berth</p>

          <div className="tags">

            <span>Coach B2</span>

            <span>Confirmed</span>

          </div>

          <div className="journey-info">

            <p>
              <strong>Train :</strong> Rajdhani Express
            </p>

            <p>
              <strong>Boarding :</strong> New Delhi
            </p>

            <p>
              <strong>Destination :</strong> Patna
            </p>

          </div>

        </div>

        <div className="preference">

          <h2>Seat Preference</h2>

          <label>Select Preferred Seat</label>

          <select>

            <option>Lower Berth</option>

            <option>Upper Berth</option>

            <option>Side Lower</option>

            <option>Side Upper</option>

            <option>Window Seat</option>

          </select>

          <button>
            Find Matches
          </button>

        </div>

      </div>

      {/* Match Section */}

      <div className="match-section">

        <h2>
          Available Matches
        </h2>

        {requests.map((item) => (

          <div
            className="match-card"
            key={item.id}
          >

            <div className="left">

              <div className="avatar">
                {item.name.charAt(0)}
              </div>

              <div className="details">

                <h3>
                  {item.name}
                </h3>

                <p>
                  <strong>Age :</strong> {item.age} Years
                </p>

                <p>
                  <strong>Gender :</strong> {item.gender}
                </p>

                <p>
                  <strong>Current Seat :</strong> {item.coach}-{item.currentSeat}
                </p>

                <p>
                  <strong>Preferred Seat :</strong> {item.preferred}
                </p>

                <p>
                  <strong>Boarding :</strong> {item.station}
                </p>

                <p>
                  <strong>Journey :</strong> {item.journey}
                </p>

              </div>

            </div>

            <div className="right">

              <div className="percentage">

                {item.match}% Match

              </div>

              <div className="progress">

                <div
                  className="progress-fill"
                  style={{
                    width: `${item.match}%`,
                  }}
                ></div>

              </div>

              <div className="buttons">

                <button className="accept">
                  Accept
                </button>

                <button className="reject">
                  Reject
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default SeatExchange;
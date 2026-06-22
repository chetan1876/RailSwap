import "../styles/seatExchange.css";

const SeatExchange = () => {
  const requests = [
    {
      id: 1,
      name: "Rahul Kumar",
      currentSeat: "B2-42",
      desiredSeat: "Lower Berth",
      match: "96%",
    },
    {
      id: 2,
      name: "Amit Singh",
      currentSeat: "B3-28",
      desiredSeat: "Window Seat",
      match: "89%",
    },
  ];

  return (
    <div className="seat-exchange-page">

      <div className="page-header">
        <h1>Seat Exchange</h1>
        <p>Find and exchange seats with compatible passengers.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h2>24</h2>
          <p>Active Requests</p>
        </div>

        <div className="stat-card">
          <h2>92%</h2>
          <p>Success Rate</p>
        </div>

        <div className="stat-card">
          <h2>156</h2>
          <p>Total Exchanges</p>
        </div>
      </div>

      <div className="seat-layout">

        <div className="current-seat-card">
          <h3>Your Current Seat</h3>
          <h2>B2 - 35</h2>
          <span>Middle Berth</span>
        </div>

        <div className="preference-card">
          <h3>Preferred Seat</h3>

          <select>
            <option>Lower Berth</option>
            <option>Upper Berth</option>
            <option>Window Seat</option>
          </select>

          <button>Find Matches</button>
        </div>

      </div>

      <div className="request-section">
        <h2>Available Matches</h2>

        {requests.map((item) => (
          <div className="request-card" key={item.id}>
            <div>
              <h3>{item.name}</h3>
              <p>{item.currentSeat}</p>
            </div>

            <div className="match-score">
              {item.match}
            </div>

            <div className="actions">
              <button className="accept-btn">
                Accept
              </button>

              <button className="reject-btn">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SeatExchange;
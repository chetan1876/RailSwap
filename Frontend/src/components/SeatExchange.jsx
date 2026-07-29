import { useEffect, useState } from "react";
import SeatExchangeForm from "./SeatExchangeForm";
import axios from "axios";

import {
  requestNotificationPermission,
  listenForMessages,
} from "../firebase";

import "../styles/SeatExchange.css";

const SeatExchange = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [requests, setRequests] = useState([]);
  const [matches, setMatches] = useState([]);

  const [latestRequest, setLatestRequest] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);

  // =====================================================
  // FIREBASE NOTIFICATION SETUP
  // =====================================================

  useEffect(() => {
    let unsubscribe = null;

    const setupNotifications = async () => {
      try {
        // Request notification permission
        await requestNotificationPermission();

        // Listen for foreground notifications
        unsubscribe = await listenForMessages(
          (payload) => {
            console.log(
              "Notification Received:",
              payload
            );

            const title =
              payload.notification?.title ||
              "RailSwap Notification";

            const body =
              payload.notification?.body ||
              "You have a new notification.";

            alert(
              `${title}\n\n${body}`
            );
          }
        );
      } catch (error) {
        console.error(
          "Notification Setup Error:",
          error
        );
      }
    };

    setupNotifications();

    // Cleanup notification listener
    return () => {
      if (
        typeof unsubscribe === "function"
      ) {
        unsubscribe();
      }
    };
  }, []);

  // =====================================================
  // FETCH ALL SEAT EXCHANGE REQUESTS
  // =====================================================

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/seat-exchange/requests"
      );

      setRequests(
        response.data.data || []
      );
    } catch (error) {
      console.error(
        "Fetch Requests Error:",
        error
      );
    }
  };

  // =====================================================
  // FETCH REQUESTS WHEN PAGE LOADS
  // =====================================================

  useEffect(() => {
    const loadRequests = async () => {
      await fetchRequests();
    };

    loadRequests();
  }, []);

  // =====================================================
  // SUBMIT SEAT EXCHANGE REQUEST
  // =====================================================

  const submitSeatExchange = async (
    formData
  ) => {
    try {
      setLoading(true);
      setMessage("");
      setMatches([]);

      const response = await axios.post(
        "http://localhost:5000/api/seat-exchange/request",
        {
          user: "user123",
          ...formData,
        }
      );

      setMessage(
        response.data.message ||
          "Seat Exchange Request Created Successfully"
      );

      setLatestRequest(
        response.data.data || {
          user: "user123",
          ...formData,
        }
      );

      await fetchRequests();
    } catch (error) {
      console.error(
        "Submit Request Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FIND MATCHING PASSENGERS
  // =====================================================

  const findMatches = async () => {
    try {
      setMatchLoading(true);
      setMessage("");

      if (!latestRequest) {
        setMessage(
          "Please submit a seat exchange request first."
        );
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/seat-exchange/find-matches",
        {
          trainNumber:
            latestRequest.trainNumber,

          journeyDate:
            latestRequest.journeyDate,

          boardingStation:
            latestRequest.boardingStation,

          destinationStation:
            latestRequest.destinationStation,

          preferredSeat:
            latestRequest.preferredSeat,
        }
      );

      setMatches(
        response.data.data || []
      );

      setMessage(
        response.data.message ||
          "Matching passengers found"
      );
    } catch (error) {
      console.error(
        "Find Matches Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to find matching passengers"
      );
    } finally {
      setMatchLoading(false);
    }
  };

  // =====================================================
  // ACCEPT SEAT EXCHANGE
  // =====================================================

  const handleAccept = async (
    requestId,
    matchedUserId
  ) => {
    try {
      setMessage("");

      const response = await axios.patch(
        `http://localhost:5000/api/seat-exchange/accept/${requestId}`,
        {
          matchedUserId:
            matchedUserId || "user123",
        }
      );

      setMessage(
        response.data.message ||
          "Seat exchange accepted successfully"
      );

      await fetchRequests();

      setMatches((prevMatches) =>
        prevMatches.map((item) =>
          item.id === requestId
            ? {
                ...item,
                status: "ACCEPTED",
                matchedUser:
                  matchedUserId ||
                  "user123",
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Accept Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to accept seat exchange"
      );
    }
  };

  // =====================================================
  // REJECT SEAT EXCHANGE
  // =====================================================

  const handleReject = async (
    requestId
  ) => {
    try {
      setMessage("");

      const response = await axios.patch(
        `http://localhost:5000/api/seat-exchange/reject/${requestId}`
      );

      setMessage(
        response.data.message ||
          "Seat exchange rejected successfully"
      );

      setMatches((prevMatches) =>
        prevMatches.filter(
          (item) =>
            item.id !== requestId
        )
      );

      await fetchRequests();
    } catch (error) {
      console.error(
        "Reject Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to reject seat exchange"
      );
    }
  };

  // =====================================================
  // CANCEL MY REQUEST
  // =====================================================

  const handleCancel = async (
    requestId
  ) => {
    try {
      setMessage("");

      const response = await axios.patch(
        `http://localhost:5000/api/seat-exchange/cancel/${requestId}`
      );

      setMessage(
        response.data.message ||
          "Seat exchange cancelled successfully"
      );

      await fetchRequests();
    } catch (error) {
      console.error(
        "Cancel Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to cancel request"
      );
    }
  };

  // =====================================================
  // CURRENT USER REQUEST
  // =====================================================

  const myRequest = requests.find(
    (item) =>
      item.user === "user123"
  );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="seat-container">

      {/* HEADER */}

      <div className="page-header">

        <h1>
          🚆 Seat Exchange
        </h1>

        <p>
          Find compatible passengers and
          exchange your seat with ease.
        </p>

      </div>

      {/* STATISTICS */}

      <div className="stats">

        <div className="card">

          <h2>
            {
              requests.filter(
                (item) =>
                  item.status ===
                  "PENDING"
              ).length
            }
          </h2>

          <span>
            Active Requests
          </span>

        </div>

        <div className="card">

          <h2>
            92%
          </h2>

          <span>
            Success Rate
          </span>

        </div>

        <div className="card">

          <h2>
            {requests.length}
          </h2>

          <span>
            Total Requests
          </span>

        </div>

      </div>

      {/* TOP SECTION */}

      <div className="top-section">

        {/* CURRENT SEAT */}

        <div className="seat-card">

          <h2>
            Your Current Seat
          </h2>

          <h1>
            B2 - 35
          </h1>

          <p>
            Middle Berth
          </p>

          <div className="tags">

            <span>
              Coach B2
            </span>

            <span>
              Confirmed
            </span>

          </div>

          <div className="journey-info">

            <p>
              <strong>
                Train :
              </strong>{" "}
              Rajdhani Express
            </p>

            <p>
              <strong>
                Train Number :
              </strong>{" "}
              12345
            </p>

            <p>
              <strong>
                Boarding :
              </strong>{" "}
              New Delhi
            </p>

            <p>
              <strong>
                Destination :
              </strong>{" "}
              Patna
            </p>

            <p>
              <strong>
                Journey Date :
              </strong>{" "}
              21 July 2026
            </p>

          </div>

          <div className="journey-status">

            <h3>
              Journey Status
            </h3>

            <div className="status-row">

              <span>
                Booking Status
              </span>

              <strong>
                Confirmed
              </strong>

            </div>

            <div className="status-row">

              <span>
                Exchange Status
              </span>

              <strong>
                Available
              </strong>

            </div>

          </div>

          <div className="exchange-info">

            <h3>
              Why Exchange Your Seat?
            </h3>

            <p>
              Find passengers with compatible
              seat preferences and request a
              seat exchange for a more
              comfortable journey.
            </p>

            <div className="info-points">

              <div>
                ✓ Verified Passenger
              </div>

              <div>
                ✓ Smart Match Suggestions
              </div>

              <div>
                ✓ Secure Seat Exchange
              </div>

            </div>

          </div>

        </div>

        {/* SEAT EXCHANGE FORM */}

        <div className="preference">

          <h2>
            Seat Exchange Request
          </h2>

          <SeatExchangeForm
            onSubmit={
              submitSeatExchange
            }
            loading={loading}
          />

          {message && (
            <p className="request-message">
              {message}
            </p>
          )}

          {/* FIND MATCH */}

          <button
            type="button"
            onClick={findMatches}
            disabled={
              matchLoading ||
              !latestRequest
            }
            className="find-match-button"
          >
            {matchLoading
              ? "Finding Matches..."
              : "🔍 Find Matching Passengers"}
          </button>

          {/* CANCEL REQUEST */}

          {myRequest &&
            myRequest.status ===
              "PENDING" && (

            <button
              type="button"
              onClick={() =>
                handleCancel(
                  myRequest.id
                )
              }
              className="cancel-button"
            >
              Cancel My Request
            </button>

          )}

        </div>

      </div>

      {/* AVAILABLE MATCHES */}

      <div className="match-section">

        <h2>
          Available Matches
        </h2>

        {matchLoading && (
          <p>
            Finding compatible passengers...
          </p>
        )}

        {!matchLoading &&
          matches.length === 0 && (

          <p>
            No matching passengers found.
            Submit your request and click
            "Find Matching Passengers".
          </p>

        )}

        {!matchLoading &&
          matches.map((item) => (

            <div
              className="match-card"
              key={item.id}
            >

              <div className="left">

                <div className="avatar">

                  {(
                    item.passengerName ||
                    "P"
                  ).charAt(0)}

                </div>

                <div className="details">

                  <h3>
                    {
                      item.passengerName ||
                      "Passenger"
                    }
                  </h3>

                  <p>
                    <strong>
                      Age :
                    </strong>{" "}
                    {item.age}
                  </p>

                  <p>
                    <strong>
                      Gender :
                    </strong>{" "}
                    {item.gender}
                  </p>

                  <p>
                    <strong>
                      Current Seat :
                    </strong>{" "}
                    {item.coach}-
                    {item.seatNumber}
                  </p>

                  <p>
                    <strong>
                      Seat Type :
                    </strong>{" "}
                    {item.seatType}
                  </p>

                  <p>
                    <strong>
                      Preferred Seat :
                    </strong>{" "}
                    {item.preferredSeat}
                  </p>

                  <p>
                    <strong>
                      Boarding :
                    </strong>{" "}
                    {item.boardingStation}
                  </p>

                  <p>
                    <strong>
                      Destination :
                    </strong>{" "}
                    {item.destinationStation}
                  </p>

                </div>

              </div>

              <div className="right">

                {item.status ===
                  "ACCEPTED" ? (

                  <div className="exchange-success">

                    <div className="success-icon">
                      ✓
                    </div>

                    <div>

                      <h3>
                        Seat Exchange Accepted
                      </h3>

                      <p>
                        Your seat exchange request
                        has been accepted successfully.
                      </p>

                      <div className="exchange-details">

                        <div>

                          <span>
                            Your Seat
                          </span>

                          <strong>
                            B2 - 35
                          </strong>

                        </div>

                        <div>

                          <span>
                            Exchange Partner
                          </span>

                          <strong>
                            {
                              item.passengerName ||
                              "Passenger"
                            }
                          </strong>

                        </div>

                        <div>

                          <span>
                            Partner Seat
                          </span>

                          <strong>
                            {item.coach}-
                            {item.seatNumber}
                          </strong>

                        </div>

                      </div>

                      <span className="accepted-badge">
                        ✓ ACCEPTED
                      </span>

                    </div>

                  </div>

                ) : (

                  <>

                    <div className="percentage">
                      Compatible Passenger
                    </div>

                    <div className="buttons">

                      <button
                        className="accept"
                        onClick={() =>
                          handleAccept(
                            item.id,
                            item.user
                          )
                        }
                      >
                        Accept
                      </button>

                      <button
                        className="reject"
                        onClick={() =>
                          handleReject(
                            item.id
                          )
                        }
                      >
                        Reject
                      </button>

                    </div>

                  </>

                )}

              </div>

            </div>

          ))}

      </div>

      {/* ALL REQUESTS */}

      <div className="match-section">

        <h2>
          My Seat Exchange Requests
        </h2>

        {requests.length === 0 ? (

          <p>
            No seat exchange requests found.
          </p>

        ) : (

          requests.map((item) => (

            <div
              className="match-card"
              key={item.id}
            >

              <div className="left">

                <div className="avatar">

                  {(
                    item.passengerName ||
                    "P"
                  ).charAt(0)}

                </div>

                <div className="details">

                  <h3>
                    {
                      item.passengerName ||
                      "Passenger"
                    }
                  </h3>

                  <p>
                    <strong>
                      Current Seat :
                    </strong>{" "}
                    {item.coach}-
                    {item.seatNumber}
                  </p>

                  <p>
                    <strong>
                      Seat Type :
                    </strong>{" "}
                    {item.seatType}
                  </p>

                  <p>
                    <strong>
                      Preferred Seat :
                    </strong>{" "}
                    {item.preferredSeat}
                  </p>

                  <p>
                    <strong>
                      Journey :
                    </strong>{" "}
                    {item.boardingStation}
                    {" → "}
                    {item.destinationStation}
                  </p>

                </div>

              </div>

              <div className="request-status-area">

                {item.status ===
                  "ACCEPTED" ? (

                  <div className="confirmed-box">

                    <div className="confirmed-icon">
                      ✓
                    </div>

                    <div>

                      <h3>
                        Exchange Confirmed
                      </h3>

                      <p>
                        Your seat exchange request
                        has been accepted successfully.
                      </p>

                      <span className="accepted-badge">
                        ✓ ACCEPTED
                      </span>

                    </div>

                  </div>

                ) : item.status ===
                  "REJECTED" ? (

                  <span className="rejected-badge">
                    ✕ REJECTED
                  </span>

                ) : item.status ===
                  "CANCELLED" ? (

                  <span className="cancelled-badge">
                    CANCELLED
                  </span>

                ) : (

                  <span className="pending-badge">
                    ⏳ PENDING
                  </span>

                )}

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
};

export default SeatExchange;
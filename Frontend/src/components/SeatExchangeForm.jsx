import { useState } from "react";
import axios from "axios";

const SeatExchangeForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    passengerName: "",
    age: "",
    gender: "Male",
    pnr: "",
    trainNumber: "",
    trainName: "",
    journeyDate: "",
    boardingStation: "",
    destinationStation: "",
    coach: "",
    seatNumber: "",
    seatType: "Lower Berth",
    preferredSeat: "Lower Berth",
  });

  const [error, setError] = useState("");
  const [pnrLoading, setPnrLoading] = useState(false);
  const [pnrVerified, setPnrVerified] = useState(false);
  const [pnrMessage, setPnrMessage] = useState("");

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // PNR - Only 10 digits
    if (name === "pnr") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;

      setPnrVerified(false);
      setPnrMessage("");
    }

    // Passenger Name
    if (name === "passengerName") {
      if (!/^[A-Za-z ]*$/.test(value)) return;
      if (value.length > 50) return;
    }

    // Age
    if (name === "age") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 3) return;
    }

    // Train Number
    if (name === "trainNumber") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 5) return;
    }

    // Seat Number
    if (name === "seatNumber") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 3) return;
    }

    // Train Name
    if (name === "trainName") {
      if (!/^[A-Za-z0-9 .&'-]*$/.test(value)) return;
      if (value.length > 80) return;
    }

    // Stations
    if (
      name === "boardingStation" ||
      name === "destinationStation"
    ) {
      if (!/^[A-Za-z .'-]*$/.test(value)) return;
      if (value.length > 60) return;
    }

    // Coach
    if (name === "coach") {
      if (!/^[A-Za-z0-9]*$/.test(value)) return;
      if (value.length > 4) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ==========================================
// VERIFY PNR
// ==========================================

const verifyPNR = async () => {
  setError("");
  setPnrMessage("");

  if (!/^\d{10}$/.test(formData.pnr)) {
    setError("PNR must contain exactly 10 digits.");
    return;
  }

  try {
    setPnrLoading(true);

    const response = await axios.post(
      "http://localhost:5000/api/pnr/verify",
      {
        pnr: formData.pnr,
      }
    );

    console.log("PNR Verification Response:", response.data);

    if (response.data.success) {
      const pnrData = response.data;
      console.log("PNR DATA:", pnrData);

      setFormData((prev) => ({
        ...prev,

        passengerName:
          pnrData.passengerName || prev.passengerName,

        age:
          pnrData.age || prev.age,

        gender:
          pnrData.gender || prev.gender,

        trainNumber:
          pnrData.trainNumber || prev.trainNumber,

        trainName:
          pnrData.trainName || prev.trainName,

        journeyDate:
          pnrData.journeyDate || prev.journeyDate,

        boardingStation:
          pnrData.from ||
          pnrData.boardingStation ||
          prev.boardingStation,

        destinationStation:
          pnrData.to ||
          pnrData.destinationStation ||
          prev.destinationStation,

        coach:
          pnrData.passengers?.[0]?.coach ||
          prev.coach,

        seatNumber:
          pnrData.passengers?.[0]?.seat ||
          prev.seatNumber,

        seatType:
          pnrData.class ||
          prev.seatType,
      }));

      setPnrVerified(true);
      setPnrMessage(
        "✓ PNR verified successfully. Ticket details loaded."
      );
    } else {
      setPnrVerified(false);
      setPnrMessage(
        response.data.message || "PNR verification failed."
      );
    }
  } catch (err) {
    console.error("PNR Verification Error:", err);

    setPnrVerified(false);

    setError(
      err.response?.data?.message ||
        "PNR verification failed. Please try again."
    );
  } finally {
    setPnrLoading(false);
  }
};
  // ==========================================
  // FORM SUBMIT
  // ==========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    // PNR Verification Check
    if (!pnrVerified) {
      setError(
        "Please verify your PNR before submitting a seat exchange request."
      );
      return;
    }

    const passengerName =
      formData.passengerName.trim();

    const trainName =
      formData.trainName.trim();

    const boardingStation =
      formData.boardingStation.trim();

    const destinationStation =
      formData.destinationStation.trim();

    const coach =
      formData.coach.trim().toUpperCase();

    // ==========================================
    // PASSENGER NAME
    // ==========================================

    if (
      !/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(
        passengerName
      )
    ) {
      setError(
        "Please enter a valid passenger name."
      );
      return;
    }

    // ==========================================
    // AGE
    // ==========================================

    const age = Number(formData.age);

    if (
      !Number.isInteger(age) ||
      age < 1 ||
      age > 120
    ) {
      setError(
        "Please enter a valid age between 1 and 120."
      );
      return;
    }

    // ==========================================
    // PNR
    // ==========================================

    if (!/^\d{10}$/.test(formData.pnr)) {
      setError(
        "PNR must contain exactly 10 digits."
      );
      return;
    }

    // ==========================================
    // TRAIN NUMBER
    // ==========================================

    if (!/^\d{5}$/.test(formData.trainNumber)) {
      setError(
        "Train number must contain exactly 5 digits."
      );
      return;
    }

    // ==========================================
    // TRAIN NAME
    // ==========================================

    if (
      trainName.length < 3 ||
      !/[A-Za-z]/.test(trainName)
    ) {
      setError(
        "Please enter a valid train name."
      );
      return;
    }

    // ==========================================
    // JOURNEY DATE
    // ==========================================

    if (!formData.journeyDate) {
      setError(
        "Please select journey date."
      );
      return;
    }

    // ==========================================
    // BOARDING STATION
    // ==========================================

    if (
      boardingStation.length < 2 ||
      !/[A-Za-z]/.test(boardingStation)
    ) {
      setError(
        "Please enter a valid boarding station."
      );
      return;
    }

    // ==========================================
    // DESTINATION STATION
    // ==========================================

    if (
      destinationStation.length < 2 ||
      !/[A-Za-z]/.test(destinationStation)
    ) {
      setError(
        "Please enter a valid destination station."
      );
      return;
    }

    // Same Station Check
    if (
      boardingStation.toLowerCase() ===
      destinationStation.toLowerCase()
    ) {
      setError(
        "Boarding and destination stations cannot be the same."
      );
      return;
    }

    // ==========================================
    // COACH
    // ==========================================

    if (
      !/^[A-Za-z]{1,2}\d{1,2}$/.test(
        coach
      )
    ) {
      setError(
        "Please enter a valid coach like S3, B2 or A1."
      );
      return;
    }

    // ==========================================
    // SEAT NUMBER
    // ==========================================

    const seatNumber = Number(
      formData.seatNumber
    );

    if (
      !Number.isInteger(seatNumber) ||
      seatNumber < 1 ||
      seatNumber > 120
    ) {
      setError(
        "Seat number must be between 1 and 120."
      );
      return;
    }

    // ==========================================
    // FINAL DATA
    // ==========================================

    const finalData = {
      ...formData,

      passengerName,
      trainName,
      boardingStation,
      destinationStation,
      coach,
      age,
      seatNumber,

      // Important
      pnrVerified: true,
    };

    // Submit to SeatExchange.jsx
    onSubmit(finalData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="seat-form"
    >

      {/* ==============================
          PNR VERIFICATION SECTION
      ============================== */}

      <div className="pnr-verification-box">

        <label>
          PNR Number
        </label>

        <div className="pnr-input-row">

          <input
            type="text"
            name="pnr"
            placeholder="Enter 10 Digit PNR"
            value={formData.pnr}
            onChange={handleChange}
            maxLength={10}
            inputMode="numeric"
            required
          />

          <button
            type="button"
            onClick={verifyPNR}
            disabled={
              pnrLoading ||
              formData.pnr.length !== 10
            }
            className="verify-pnr-button"
          >
            {pnrLoading
              ? "Verifying..."
              : "Verify PNR"}
          </button>

        </div>

        {pnrMessage && (
          <p className="pnr-success-message">
            {pnrMessage}
          </p>
        )}

      </div>

      {/* ==============================
          PASSENGER DETAILS
      ============================== */}

      <input
        type="text"
        name="passengerName"
        placeholder="Passenger Name"
        value={formData.passengerName}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        min="1"
        max="120"
        required
      />

      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
      >
        <option value="Male">
          Male
        </option>

        <option value="Female">
          Female
        </option>

        <option value="Other">
          Other
        </option>
      </select>

      {/* ==============================
          TRAIN DETAILS
      ============================== */}

      <input
        type="text"
        name="trainNumber"
        placeholder="5 Digit Train Number"
        value={formData.trainNumber}
        onChange={handleChange}
        maxLength={5}
        inputMode="numeric"
        required
      />

      <input
        type="text"
        name="trainName"
        placeholder="Train Name"
        value={formData.trainName}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="journeyDate"
        value={formData.journeyDate}
        onChange={handleChange}
        required
      />

      {/* ==============================
          JOURNEY DETAILS
      ============================== */}

      <input
        type="text"
        name="boardingStation"
        placeholder="Boarding Station"
        value={formData.boardingStation}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="destinationStation"
        placeholder="Destination Station"
        value={formData.destinationStation}
        onChange={handleChange}
        required
      />

      {/* ==============================
          SEAT DETAILS
      ============================== */}

      <input
        type="text"
        name="coach"
        placeholder="Coach (Example: S3)"
        value={formData.coach}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="seatNumber"
        placeholder="Seat Number (1-120)"
        value={formData.seatNumber}
        onChange={handleChange}
        inputMode="numeric"
        required
      />

      <select
        name="seatType"
        value={formData.seatType}
        onChange={handleChange}
      >
        <option value="Lower Berth">
          Current Seat: Lower Berth
        </option>

        <option value="Middle Berth">
          Current Seat: Middle Berth
        </option>

        <option value="Upper Berth">
          Current Seat: Upper Berth
        </option>

        <option value="Side Lower">
          Current Seat: Side Lower
        </option>

        <option value="Side Upper">
          Current Seat: Side Upper
        </option>

        <option value="Window Seat">
          Current Seat: Window Seat
        </option>
      </select>

      <select
        name="preferredSeat"
        value={formData.preferredSeat}
        onChange={handleChange}
      >
        <option value="Lower Berth">
          Want: Lower Berth
        </option>

        <option value="Middle Berth">
          Want: Middle Berth
        </option>

        <option value="Upper Berth">
          Want: Upper Berth
        </option>

        <option value="Side Lower">
          Want: Side Lower
        </option>

        <option value="Side Upper">
          Want: Side Upper
        </option>

        <option value="Window Seat">
          Want: Window Seat
        </option>
      </select>

      {/* ==============================
          ERROR
      ============================== */}

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      {/* ==============================
          SUBMIT
      ============================== */}

      <button
        type="submit"
        disabled={
          loading ||
          !pnrVerified
        }
      >
        {loading
          ? "Submitting..."
          : "Submit Seat Exchange Request"}
      </button>

    </form>
  );
};

export default SeatExchangeForm;
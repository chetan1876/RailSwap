import React, { useState } from "react";
import { registerRFID } from "../services/rfid.service";
import "../styles/pnrRfidRegistration.css";

const PnrRfidRegistration = () => {
  const [pnrInput, setPnrInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [rfidData, setRfidData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    setCopied(false);

    const cleanPnr = pnrInput.trim();

    if (!cleanPnr) {
      setErrorMsg("Please enter a 10-digit PNR number.");
      return;
    }

    if (!/^\d{10}$/.test(cleanPnr)) {
      setErrorMsg("Invalid PNR format. PNR must be a 10-digit number.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerRFID(cleanPnr);

      if (response && response.success) {
        setRfidData(response.data);
        if (response.isExisting) {
          setInfoMsg("Existing RFID Registration found for this PNR.");
        }
      } else {
        setErrorMsg(response?.message || "Failed to register RFID. Please try again.");
      }
    } catch (err) {
      console.error("RFID registration error:", err);
      setErrorMsg(
        err.response?.data?.message ||
          "Error connecting to server. Please verify network and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRFID = () => {
    if (rfidData?.rfidId) {
      navigator.clipboard.writeText(rfidData.rfidId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="pnr-rfid-container">
      {/* HEADER SECTION */}
      <div className="pnr-rfid-header">
        <h1 className="pnr-rfid-title">
          <i className="fa-solid fa-id-card"></i> Register Your Railway RFID
        </h1>
        <p className="pnr-rfid-description">
          Enter your PNR to generate a unique RFID identity for your journey.
        </p>

        {/* DISCLAIMER NOTICE (Requirement 15) */}
        <div className="pnr-rfid-disclaimer">
          <i className="fa-solid fa-circle-info"></i>
          <div>
            <strong>Identity Association Note:</strong> This feature generates and stores
            the digital RFID identity associated with your physical railway tag. The website
            does not physically track hardware RFID tags directly.
          </div>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="pnr-rfid-card-wrapper">
        <form onSubmit={handleRegister} className="pnr-rfid-form">
          <div className="form-group">
            <label htmlFor="pnr-input">PNR Number</label>
            <input
              id="pnr-input"
              type="text"
              className="pnr-input-field"
              placeholder="Enter 10-digit PNR (e.g. 1234567890)"
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value)}
              maxLength={10}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="pnr-submit-btn"
            disabled={loading || !pnrInput.trim()}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Verifying PNR & Generating...
              </>
            ) : (
              <>
                <i className="fa-solid fa-key"></i> Verify PNR & Generate RFID
              </>
            )}
          </button>
        </form>

        {/* ERROR BANNER */}
        {errorMsg && (
          <div className="alert-banner error">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* INFO BANNER FOR EXISTING REGISTRATION */}
        {infoMsg && (
          <div className="alert-banner info">
            <i className="fa-solid fa-circle-check"></i>
            <span>{infoMsg}</span>
          </div>
        )}

        {/* RFID CARD DISPLAY */}
        {rfidData && (
          <div className="rfid-card-display-container">
            <div className="rfid-card">
              <div className="rfid-card-header">
                <div className="rfid-logo-group">
                  <i className="fa-solid fa-wifi rfid-logo-icon"></i>
                  <span className="rfid-brand-title">RailSwap RFID</span>
                </div>
                <div className="rfid-chip"></div>
              </div>

              <div className="rfid-card-body">
                <div className="rfid-detail-row">
                  <span className="rfid-label">Passenger</span>
                  <span className="rfid-value highlight">
                    {rfidData.passengerName || "Bittu Kumar"}
                  </span>
                </div>

                <div className="rfid-detail-row">
                  <span className="rfid-label">PNR</span>
                  <span className="rfid-value">{rfidData.pnr}</span>
                </div>

                <div className="rfid-detail-row">
                  <span className="rfid-label">Train</span>
                  <span className="rfid-value">
                    {rfidData.trainName}{" "}
                    {rfidData.trainNumber ? `(${rfidData.trainNumber})` : ""}
                  </span>
                </div>

                <div className="rfid-detail-row">
                  <span className="rfid-label">Coach / Seat</span>
                  <span className="rfid-value">
                    Coach: {rfidData.coach || "A1"} | Seat: {rfidData.seat || "34"}
                  </span>
                </div>

                <div className="rfid-detail-row">
                  <span className="rfid-label">Route</span>
                  <span className="rfid-value">
                    {rfidData.from || "New Delhi"} &rarr; {rfidData.to || "Patna Junction"}
                  </span>
                </div>
              </div>

              <div className="rfid-id-section">
                <div className="rfid-id-label">RFID ID</div>
                <div className="rfid-id-value">{rfidData.rfidId}</div>
              </div>

              <div className="rfid-card-footer">
                <span className="rfid-label">Status</span>
                <span className="rfid-status-badge">
                  <span className="dot"></span> {rfidData.status || "ACTIVE"}
                </span>
              </div>
            </div>

            {/* COPY BUTTON */}
            <button
              type="button"
              className={`copy-rfid-btn ${copied ? "copied" : ""}`}
              onClick={handleCopyRFID}
            >
              {copied ? (
                <>
                  <i className="fa-solid fa-check"></i> Copied to Clipboard!
                </>
              ) : (
                <>
                  <i className="fa-solid fa-copy"></i> Copy RFID ID
                </>
              )}
            </button>

            {/* COLLECTION INFO MESSAGE */}
            <p className="rfid-collect-info">
              📍 Collect your physical RFID tag from your boarding station and attach it to your luggage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PnrRfidRegistration;

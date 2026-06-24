import { useState } from "react";
import {
  FaQrcode,
  FaCircleCheck,
  FaUser,
  FaTicket,
  FaTrain,
  FaLocationDot,
  FaUpload,
} from "react-icons/fa6";

import "../styles/qrVerification.css";

const QRVerification = () => {
  const [image, setImage] = useState(null);
  const [verified, setVerified] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
      setVerified(false);
    }
  };

  const verifyQR = () => {
    setVerified(true);
  };

  return (
    <div className="qr-page">

      <div className="qr-header">
        <h1>QR Verification</h1>
        <p>
          Verify passengers instantly using QR codes.
        </p>
      </div>

      <div className="upload-card">

        <div className="upload-top">

          <div>
            <h3>Upload QR Image</h3>
            <p>Upload a QR code image for verification</p>
          </div>

          <div className="qr-icon">
            <FaQrcode />
          </div>

        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
        />

        {image && (
          <div className="preview-container">
            <img
              src={image}
              alt="QR Preview"
            />
          </div>
        )}

        <button onClick={verifyQR}>
          <FaUpload />
          Verify QR
        </button>

      </div>

      {verified && (

        <div className="verified-card">

          <div className="verified-header">

            <div>
              <h2>Verification Details</h2>
              <p>Passenger successfully verified</p>
            </div>

            <div className="verified-badge">
              <FaCircleCheck />
              VERIFIED
            </div>

          </div>

          <div className="verified-grid">

            <div className="info-box">
              <span>
                <FaUser /> Passenger
              </span>
              <h4>Chetan Kumar</h4>
            </div>

            <div className="info-box">
              <span>
                <FaTicket /> PNR
              </span>
              <h4>1234567890</h4>
            </div>

            <div className="info-box">
              <span>
                <FaTrain /> Coach
              </span>
              <h4>B2</h4>
            </div>

            <div className="info-box">
              <span>
                <FaTicket /> Seat
              </span>
              <h4>35</h4>
            </div>

            <div className="info-box">
              <span>
                <FaCircleCheck /> Status
              </span>
              <h4>Confirmed</h4>
            </div>

            <div className="info-box">
              <span>
                <FaLocationDot /> Journey
              </span>
              <h4>Delhi → Kolkata</h4>
            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default QRVerification;
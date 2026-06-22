import { useState } from "react";
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
          Verify passengers instantly using QR code.
        </p>
      </div>

      <div className="upload-card">

        <h3>Upload QR Image</h3>

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
          Verify QR
        </button>

      </div>

      {verified && (

        <div className="verified-card">

          <div className="verified-badge">
            VERIFIED
          </div>

          <div className="verified-grid">

            <div className="info-box">
              <span>Passenger</span>
              <h4>Chetan Kumar</h4>
            </div>

            <div className="info-box">
              <span>PNR</span>
              <h4>1234567890</h4>
            </div>

            <div className="info-box">
              <span>Coach</span>
              <h4>B2</h4>
            </div>

            <div className="info-box">
              <span>Seat</span>
              <h4>35</h4>
            </div>

            <div className="info-box">
              <span>Status</span>
              <h4>Confirmed</h4>
            </div>

            <div className="info-box">
              <span>Journey</span>
              <h4>Delhi → Kolkata</h4>
            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default QRVerification;
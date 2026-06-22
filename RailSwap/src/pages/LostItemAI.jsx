import { useState } from "react";
import "../styles/lostItemAI.css";

const LostItemAI = () => {
  const [image, setImage] = useState(null);
  const [searched, setSearched] = useState(false);

  const foundItems = [
    {
      item: "Black Backpack",
      location: "Platform 5",
      confidence: "98%",
    },
    {
      item: "Laptop Bag",
      location: "Waiting Hall",
      confidence: "92%",
    },
    {
      item: "Blue Trolley",
      location: "Coach B2",
      confidence: "88%",
    },
  ];

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
      setSearched(false);
    }
  };

  const searchItem = () => {
    setSearched(true);
  };

  return (
    <div className="lost-page">

      <div className="lost-header">
        <h1>Lost Item AI Detection</h1>

        <p>
          Upload an image and let AI search
          for matching lost items across
          stations and coaches.
        </p>
      </div>

      <div className="lost-top-grid">

        <div className="upload-card">

          <h3>Upload Lost Item</h3>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          {image && (
            <img
              src={image}
              alt="Preview"
              className="preview-image"
            />
          )}

          <button onClick={searchItem}>
            Search With AI
          </button>

        </div>

        <div className="stats-card">

          <div className="stat-box">
            <h2>124</h2>
            <p>Recovered Items</p>
          </div>

          <div className="stat-box">
            <h2>96%</h2>
            <p>Detection Accuracy</p>
          </div>

          <div className="stat-box">
            <h2>48</h2>
            <p>Active Reports</p>
          </div>

        </div>

      </div>

      {searched && (

        <div className="results-card">

          <h2>AI Matching Results</h2>

          {foundItems.map((item, index) => (

            <div
              key={index}
              className="result-item"
            >

              <div>
                <h3>{item.item}</h3>
                <p>{item.location}</p>
              </div>

              <span>
                {item.confidence}
              </span>

            </div>

          ))}

        </div>

      )}

      <div className="history-card">

        <h2>Recent Lost Item Reports</h2>

        <div className="history-table">

          <div className="history-row">
            <span>Wallet</span>
            <span>Platform 2</span>
            <span>Recovered</span>
          </div>

          <div className="history-row">
            <span>Backpack</span>
            <span>B3 Coach</span>
            <span>Searching</span>
          </div>

          <div className="history-row">
            <span>Mobile Phone</span>
            <span>Waiting Hall</span>
            <span>Recovered</span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LostItemAI;
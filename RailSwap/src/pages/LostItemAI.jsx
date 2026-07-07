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
      image:
        "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600",
    },
    {
      item: "Laptop Bag",
      location: "Waiting Hall",
      confidence: "92%",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600",
    },
    {
      item: "Blue Trolley",
      location: "Coach B2",
      confidence: "88%",
      image:
        "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600",
    },
  ];

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
      setSearched(false);
    }
  };

  return (
    <div className="lost-page">
      <div className="lost-header">
        <div>
          <h1>🤖 Lost Item AI Detection</h1>
          <p>
            Upload an image and let AI search matching items across stations.
          </p>
        </div>

        <div className="ai-badge">AI Accuracy 96%</div>
      </div>

      <div className="lost-top-grid">
        <div className="upload-card">
          <h3>Upload Lost Item</h3>

          <input type="file" accept="image/*" onChange={handleImage} />

          {image && <img src={image} alt="Preview" className="preview-image" />}

          <button onClick={() => setSearched(true)}>Search With AI</button>
        </div>

        <div className="stats-card">
          <div className="stat-box">
            <h2>124</h2>
            <p>Recovered Items</p>
          </div>

          <div className="stat-box">
            <h2>96%</h2>
            <p>AI Accuracy</p>
          </div>

          <div className="stat-box">
            <h2>48</h2>
            <p>Active Reports</p>
          </div>
        </div>
      </div>

      <div className="ai-status-card">
        <h2>🧠 AI Processing Status</h2>

        <div className="status-item">
          <span>Image Analysis</span>
          <span className="success">Completed</span>
        </div>

        <div className="status-item">
          <span>Object Recognition</span>
          <span className="success">Running</span>
        </div>

        <div className="status-item">
          <span>Database Matching</span>
          <span className="success">Connected</span>
        </div>
      </div>

      {searched && (
        <div className="results-card">
          <h2>🎯 AI Matching Results</h2>

          <div className="item-gallery">
            {foundItems.map((item, index) => (
              <div className="item-card" key={index}>
                <img src={item.image} alt={item.item} />

                <div className="item-info">
                  <h3>{item.item}</h3>

                  <p>📍 {item.location}</p>

                  <span>Match {item.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="history-card">
        <h2>📋 Recent Reports</h2>

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

      <div className="reward-recovery-card">
        <h2>🏆 Recovery Rewards</h2>

        <p>Help identify lost items and earn RailSwap reward points.</p>

        <button>Claim Rewards</button>
      </div>
    </div>
  );
};

export default LostItemAI;

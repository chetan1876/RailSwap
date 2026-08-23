import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    { title: "Seat Exchange", icon: "fa-right-left", path: "/seat-exchange" },
    { title: "PNR Verification", icon: "fa-ticket", path: "/pnr-verification" },

    { title: "QR Verification", icon: "fa-qrcode", path: "/qr-verification" },

    { title: "AI Recommendation", icon: "fa-robot", path: "/ai-recommendation" },
    { title: "Journey Companion", icon: "fa-user-group", path: "/journey-companion" },
    { title: "AI Chatbot", icon: "fa-comments", path: "/chatbot" },

    // { title: "Live Coach Map", icon: "fa-map-location-dot", path: "/live-coach-map" },
    { title: "Train Information", icon: "fa-train", path: "/train-information" },
    // { title: "Station Navigator", icon: "fa-location-dot", path: "/station-navigator" },
    // { title: "Reward System", icon: "fa-gift", path: "/reward-system" },

    { title: "Lost Item AI", icon: "fa-magnifying-glass", path: "/lost-item-ai" },
    { title: "Crowd Density", icon: "fa-chart-column", path: "/crowd-density" },
    // { title: "Women Safety", icon: "fa-shield-halved", path: "/women-safety" },
    { title: "Medical Match", icon: "fa-briefcase-medical", path: "/emergency-medical" },
    { title: "Train Information", icon: "fa-train", path: "/train-delay" },
    {
      title: "PNR RFID Registration",
      icon: "fa-id-card",
      path: "/pnr-rfid",
      description: "Generate and manage your RFID ID using your PNR.",
      buttonText: "Get RFID",
    },
  ];

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <h1>RailSwap Dashboard</h1>
        <p>Smart Railway Passenger Assistance Platform</p>
      </div>

      <div className="dashboard-grid">

        {features.map((item, index) => (
          <div
            key={index}
            className="dashboard-card"
            onClick={() => navigate(item.path)}
          >
            <div className="card-icon">
              <i className={`fa-solid ${item.icon}`}></i>
            </div>

            <h3>{item.title}</h3>
            {item.description && (
              <p style={{ fontSize: "11px", color: "#6b7280", margin: "6px 0 10px", lineHeight: "1.3" }}>
                {item.description}
              </p>
            )}
            {item.buttonText && (
              <button
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "4px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(item.path);
                }}
              >
                {item.buttonText}
              </button>
            )}
          </div>
        ))}

      </div>

    </div>
  );
};

export default Dashboard;
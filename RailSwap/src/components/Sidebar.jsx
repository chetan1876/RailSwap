import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../styles/sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const featureItems = [
    {
      name: "AI Recommendation",
      icon: "fa-solid fa-robot",
      path: "/ai-recommendation",
    },
    {
      name: "Journey Companion",
      icon: "fa-solid fa-users",
      path: "/journey-companion",
    },
    {
      name: "AI Chatbot",
      icon: "fa-solid fa-comments",
      path: "/chatbot",
    },
    {
      name: "Lost Item AI",
      icon: "fa-solid fa-magnifying-glass",
      path: "/lost-item-ai",
    },
    {
      name: "Crowd Density",
      icon: "fa-solid fa-chart-column",
      path: "/crowd-density",
    },
    {
      name: "Women Safety",
      icon: "fa-solid fa-shield-halved",
      path: "/women-safety",
    },
    {
      name: "Emergency Medical",
      icon: "fa-solid fa-briefcase-medical",
      path: "/emergency-medical",
    },

    
  {
    name: "AI Recommendation",
    icon: "fa-solid fa-robot",
    path: "/ai-recommendation",
  },
  {
    name: "Journey Companion",
    icon: "fa-solid fa-users",
    path: "/journey-companion",
  },
  {
    name: "AI Chatbot",
    icon: "fa-solid fa-comments",
    path: "/chatbot",
  },
  {
    name: "Lost Item AI",
    icon: "fa-solid fa-magnifying-glass",
    path: "/lost-item-ai",
  },
  {
    name: "Crowd Density",
    icon: "fa-solid fa-chart-column",
    path: "/crowd-density",
  },
  {
    name: "Women Safety",
    icon: "fa-solid fa-shield-halved",
    path: "/women-safety",
  },
  {
    name: "Emergency Medical",
    icon: "fa-solid fa-briefcase-medical",
    path: "/emergency-medical",
  },

  // New Features

  {
    name: "Live Coach Map",
    icon: "fa-solid fa-train",
    path: "/live-coach-map",
  },
  {
    name: "Multi Seat Swap",
    icon: "fa-solid fa-right-left",
    path: "/multi-seat-swap",
  },
  {
    name: "Nearby Station Guide",
    icon: "fa-solid fa-map-location-dot",
    path: "/station-guide",
  },
  {
    name: "Food Ordering",
    icon: "fa-solid fa-utensils",
    path: "/food-ordering",
  },
  {
    name: "Train Tracking",
    icon: "fa-solid fa-location-crosshairs",
    path: "/train-tracking",
  },
  {
    name: "Luggage Tracker",
    icon: "fa-solid fa-suitcase",
    path: "/luggage-tracker",
  },
  {
    name: "PNR Status",
    icon: "fa-solid fa-ticket",
    path: "/pnr-status",
  },
  {
    name: "Complaint Portal",
    icon: "fa-solid fa-circle-exclamation",
    path: "/complaint-portal",
  },
  {
    name: "Travel History",
    icon: "fa-solid fa-clock-rotate-left",
    path: "/travel-history",
  },
  {
    name: "Rail News",
    icon: "fa-solid fa-newspaper",
    path: "/rail-news",
  },




  ];

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      <aside
        className={`sidebar ${
          isOpen ? "active" : ""
        }`}
      >
        <div className="sidebar-menu">

          <NavLink
            to="/dashboard"
            className="sidebar-link"
          >
            <i className="fa-solid fa-house"></i>
            Dashboard
          </NavLink>

          <h4 className="sidebar-section-title">
            FEATURES
          </h4>

          {featureItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className="sidebar-link"
            >
              <i className={item.icon}></i>
              {item.name}
            </NavLink>
          ))}

        </div>

        <div className="sidebar-bottom">
          <NavLink
            to="/settings"
            className="sidebar-link"
          >
            <i className="fa-solid fa-gear"></i>
            Settings
          </NavLink>
        </div>
      </aside>

      <div className="bottom-nav">
        <NavLink to="/dashboard">
          <i className="fa-solid fa-house"></i>
        </NavLink>

        <NavLink to="/ai-recommendation">
          <i className="fa-solid fa-robot"></i>
        </NavLink>

        <NavLink to="/settings">
          <i className="fa-solid fa-gear"></i>
        </NavLink>
      </div>
    </>
  );
};

export default Sidebar;
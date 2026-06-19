import { Link } from "react-router-dom";
import "../styles/landing.css";

const LandingPage = () => {
  const features = [
    "AI Recommendation",
    "Journey Companion",
    "AI Chatbot",
    "Women Safety",
    "Emergency Medical",
    "Lost Item AI",
  ];

  const faqs = [
    {
      q: "What is RailSwap?",
      a: "RailSwap is an AI-powered railway passenger assistance platform designed to improve comfort, safety, and travel experience.",
    },
    {
      q: "Is seat exchange secure?",
      a: "Yes. All exchanges are validated through the platform to ensure passenger safety and authenticity.",
    },
    {
      q: "Can I access future modules?",
      a: "Yes. New AI-powered modules will be available in future updates.",
    },
  ];

  return (
    <div className="landing">

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-left">

          <span className="hero-badge">
            🚆 AI Powered Railway Platform
          </span>

          <h1>
            Smart Railway Seat Exchange &
            Passenger Assistance Platform
          </h1>

          <p>
            AI powered seat recommendations,
            journey companion matching,
            emergency medical support,
            women safety assistance,
            crowd prediction and passenger
            comfort in one intelligent platform.
          </p>

          <div className="hero-buttons">

            <Link
              to="/register"
              className="primary-btn"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="secondary-btn"
            >
              Login
            </Link>

          </div>

          <div className="hero-stats">

            <div>
              <h3>100K+</h3>
              <p>Passengers</p>
            </div>

            <div>
              <h3>50K+</h3>
              <p>Exchanges</p>
            </div>

            <div>
              <h3>95%</h3>
              <p>Success Rate</p>
            </div>

          </div>

        </div>

        <div className="hero-right">

          <div className="hero-card">

            <h3>🤖 AI Seat Recommendation</h3>

            <p>
              Recommended Seat:
              Lower Berth - Coach B2
            </p>

            <div className="hero-progress">
              <div></div>
            </div>

            <span>98% Match Score</span>

          </div>

          <div className="hero-card small-card">

            <h4>👥 Journey Companion Match</h4>

            <p>
              3 Compatible Travelers Found
            </p>

          </div>

          <div className="hero-card small-card">

            <h4>🛡 Women Safety</h4>

            <p>
              Safe Seat Suggestions Available
            </p>

          </div>

          <div className="hero-card small-card">

            <h4>🎫 Seat Exchange</h4>

            <p>
              12 Active Exchange Requests
            </p>

          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section className="features">

        <h2>Feature Preview</h2>

        <div className="feature-grid">

          {features.map((feature, index) => (
            <div
              className="feature-card"
              key={index}
            >
              <i className="fa-solid fa-train-subway"></i>

              <h3>{feature}</h3>

              <p>
                AI powered module designed
                to improve passenger comfort
                and railway experience.
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="how-it-works">

        <h2>How It Works</h2>

        <div className="steps">

          <div className="step">
            <span>1</span>
            Verify Journey
          </div>

          <div className="step">
            <span>2</span>
            Find Match
          </div>

          <div className="step">
            <span>3</span>
            Confirm Exchange
          </div>

          <div className="step">
            <span>4</span>
            Travel Comfortably
          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="stats">

        <div className="stat-card">
          <h2>100K+</h2>
          <p>Users</p>
        </div>

        <div className="stat-card">
          <h2>50K+</h2>
          <p>Exchanges</p>
        </div>

        <div className="stat-card">
          <h2>95%</h2>
          <p>Success Rate</p>
        </div>

      </section>

      {/* ================= FAQ ================= */}

      <section className="faq">

        <h2>Frequently Asked Questions</h2>

        {faqs.map((faq, index) => (
          <div
            className="faq-item"
            key={index}
          >
            <h3>{faq.q}</h3>
            <p>{faq.a}</p>
          </div>
        ))}

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <h3>🚆 RailSwap</h3>

        <p>
          AI Powered Railway Seat Exchange &
          Passenger Assistance Platform
        </p>

        <small>
          © 2026 RailSwap. All Rights Reserved.
        </small>

      </footer>

    </div>
  );
};

export default LandingPage;
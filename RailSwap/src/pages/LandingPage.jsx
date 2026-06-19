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
      a: "AI powered railway passenger assistance platform."
    },
    {
      q: "Is seat exchange secure?",
      a: "Yes, exchange is verified through platform validation."
    },
    {
      q: "Can I access future modules?",
      a: "They will be released in upcoming updates."
    }
  ];

  return (
    <div className="landing">

      <section className="hero">

        <div className="hero-content">

          <h1>
            AI Powered Railway Seat
            Exchange & Passenger
            Assistance System
          </h1>

          <p>
            Smart seat exchange,
            passenger safety,
            AI recommendations,
            and travel assistance
            in one platform.
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

        </div>
      </section>

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
                Coming soon in
                future releases.
              </p>
            </div>
          ))}

        </div>

      </section>

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

      <section className="faq">

        <h2>FAQ</h2>

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

      <footer className="footer">
        <h3>RailSwap</h3>

        <p>
          AI Powered Railway Seat
          Exchange & Passenger
          Assistance System
        </p>

        <small>
          © 2026 RailSwap. All Rights Reserved.
        </small>
      </footer>

    </div>
  );
};

export default LandingPage;
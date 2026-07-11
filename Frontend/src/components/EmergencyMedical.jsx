import { useState } from "react";
import "../styles/emergencyMedical.css";

const EmergencyMedical = () => {
  const [bloodGroup] = useState("O+");

  const doctors = [
    {
      name: "Dr. Raj Sharma",
      speciality: "General Physician",
      distance: "0.8 KM",
    },
    {
      name: "Dr. Priya Singh",
      speciality: "Emergency Care",
      distance: "1.2 KM",
    },
    {
      name: "Dr. Amit Verma",
      speciality: "Cardiologist",
      distance: "2.1 KM",
    },
  ];

  const donors = [
    {
      name: "Rahul Kumar",
      blood: "O+",
      coach: "B2",
    },
    {
      name: "Ankit Singh",
      blood: "O+",
      coach: "B3",
    },
    {
      name: "Priya Sharma",
      blood: "O+",
      coach: "A1",
    },
  ];

  return (
    <div className="medical-page">
      <div className="medical-header">
        <h1>Emergency Medical Match</h1>

        <p>
          Connect instantly with doctors, medical volunteers and blood donors
          during emergencies.
        </p>
      </div>

      <div className="medical-top-grid">
        <div className="medical-score-card">
          <h3>Emergency Response</h3>

          <div className="medical-circle">2 Min</div>

          <p>Average Response Time</p>
        </div>

        <div className="medical-stats">
          <div className="medical-stat-card">
            <div className="stat-icon doctor-icon">👨‍⚕️</div>

            <h2>32</h2>

            <p>Doctors Nearby</p>

            <span className="status online">● 18 Available Now</span>

            <div className="progress">
              <div
                className="progress-fill doctor-fill"
                style={{ width: "80%" }}
              ></div>
            </div>

            <small>Average Arrival : 4 min</small>
          </div>

          <div className="medical-stat-card">
            <div className="stat-icon volunteer-icon">🩺</div>

            <h2>114</h2>

            <p>Medical Volunteers</p>

            <span className="status success">● Active in Train</span>

            <div className="progress">
              <div
                className="progress-fill volunteer-fill"
                style={{ width: "90%" }}
              ></div>
            </div>

            <small>78 Ready to Help</small>
          </div>

          <div className="medical-stat-card">
            <div className="stat-icon support-icon">📞</div>

            <h2>24×7</h2>

            <p>Emergency Support</p>

            <span className="status emergency">● Always Online</span>

            <div className="progress">
              <div
                className="progress-fill support-fill"
                style={{ width: "100%" }}
              ></div>
            </div>

            <small>Instant AI Assistance</small>
          </div>
        </div>
      </div>

      <div className="sos-card">
        <h2>Emergency Actions</h2>

        <div className="sos-buttons">
          <button className="sos-btn">🚨 Emergency SOS</button>

          <button className="doctor-btn">👨‍⚕️ Find Doctor</button>

          <button className="hospital-btn">🏥 Nearest Hospital</button>
        </div>
      </div>

      <div className="doctor-section">
        <h2>Nearby Medical Experts</h2>

        {doctors.map((doctor, index) => (
          <div key={index} className="doctor-card">
            <div>
              <h3>{doctor.name}</h3>
              <p>{doctor.speciality}</p>
            </div>

            <span>{doctor.distance}</span>

            <button>Contact</button>
          </div>
        ))}
      </div>

      <div className="blood-card">
        <h2>Blood Donor Match</h2>

        <div className="blood-header">
          <span>Required Blood Group</span>

          <strong>{bloodGroup}</strong>
        </div>

        {donors.map((donor, index) => (
          <div key={index} className="donor-card">
            <div>
              <h3>{donor.name}</h3>
              <p>Coach {donor.coach}</p>
            </div>

            <span className="blood-badge">{donor.blood}</span>
          </div>
        ))}
      </div>

      <div className="medical-ai-card">
        <h3>AI Medical Insight</h3>

        <p>
          Nearest medical assistance is available within 2 minutes. Three
          verified O+ blood donors are currently traveling nearby.
        </p>
      </div>
    </div>
  );
};

export default EmergencyMedical;
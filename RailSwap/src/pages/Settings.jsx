import "../styles/dashboard.css";

const settingsData = [
  {
    title: "Account Settings",
    description:
      "Update account details and personal information.",
    button: "Manage Account",
  },
  {
    title: "Notification Settings",
    description:
      "Control email, SMS and platform notifications.",
    button: "Configure",
  },
  {
    title: "Privacy Settings",
    description:
      "Manage profile visibility and privacy preferences.",
    button: "Privacy Controls",
  },
  {
    title: "Language Settings",
    description:
      "Choose your preferred language experience.",
    button: "Change Language",
  },
  {
    title: "Theme Settings",
    description:
      "Customize appearance and accessibility options.",
    button: "Appearance",
  },
];

const Settings = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>Settings</h1>

        <p>
          Manage your account, privacy and preferences.
        </p>
      </div>

      <div className="settings-grid">
        {settingsData.map((item, index) => (
          <div className="setting-card" key={index}>
            <h3>{item.title}</h3>

            <p>{item.description}</p>

            <button>{item.button}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
import {
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import OTPVerification from "../pages/OTPVerification";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";

/*
=================================================
Future Modules (Other Developers)

AI Recommendation
Journey Companion
AI Chatbot
Lost Item AI
Crowd Density
Women Safety
Emergency Medical
Seat Exchange
PNR Verification
Coach Heatmap
Station Navigator

These modules will be injected inside
the Outlet area below.
=================================================
*/

const DashboardLayout = () => {
  return (
    <>
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

const AppRoutes = () => {
  return (
    <Routes>

      {/* Public Routes */}

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/otp"
        element={<OTPVerification />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* Protected Routes */}

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/Dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        {/*
        =========================================
        Future Routes By Other Developers

        <Route path="/ai-recommendation" />
        <Route path="/journey-companion" />
        <Route path="/ai-chatbot" />
        <Route path="/lost-item-ai" />
        <Route path="/crowd-density" />
        <Route path="/women-safety" />
        <Route path="/emergency-medical" />
        =========================================
        */}

      </Route>

    </Routes>
  );
};

export default AppRoutes;
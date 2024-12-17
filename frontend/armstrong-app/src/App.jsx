import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import ArmstrongVerification from "./pages/ArmstrongVerification";
import UserDashboard from "./pages/Dashboard";
import GlobalDashboard from "./pages/GlobalDashboardPage";
import Login from "./pages/Login";
import Navbar from "./components/navbar";
     
const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Home Page: Registration */}
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Armstrong Verification Page */}
          <Route path="/verify" element={<ArmstrongVerification />} />

          {/* User Dashboard Page */}
          {/* Pass the userId as a URL parameter */}
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Global Dashboard Page */}
          <Route path="/global" element={<GlobalDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

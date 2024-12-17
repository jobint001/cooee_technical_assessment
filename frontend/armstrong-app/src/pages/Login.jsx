import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/users/login", { email });
      if (response.status === 200) {
        localStorage.setItem("email", email);
        navigate("/verify"); // Redirect to Verify Armstrong page
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-6">
      <div className="bg-white border-t-8 border-[#17408B] p-10 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-[#17408B] mb-6">Login</h1>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#17408B] focus:border-[#17408B] text-gray-700"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full mt-6 bg-[#17408B] text-white py-2 px-4 rounded-md font-medium shadow hover:bg-[#102C5B] focus:outline-none focus:ring-2 focus:ring-[#17408B] focus:ring-offset-2 transition duration-300"
        >
          Login
        </button>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Login;

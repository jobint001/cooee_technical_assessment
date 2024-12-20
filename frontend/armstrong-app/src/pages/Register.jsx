import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/users/register", {
        email,
      });
      setMessage(`Welcome! Redirecting...`);
      localStorage.setItem("email", email);
      setTimeout(() => navigate("/verify"), 1500); // Redirect to verification page
    } catch (error) {
      setError(error.response?.data || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-6">
      <div className="bg-white border-t-8 border-[#17408B] p-10 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-[#17408B] mb-6">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#17408B] focus:border-[#17408B] text-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#17408B] text-white py-2 px-4 rounded-md font-medium shadow hover:bg-[#102C5B] focus:outline-none focus:ring-2 focus:ring-[#17408B] focus:ring-offset-2 transition duration-300"
          >
            Register
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default Register;

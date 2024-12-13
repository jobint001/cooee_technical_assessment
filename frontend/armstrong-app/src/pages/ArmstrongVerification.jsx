import React, { useState } from "react";
import axios from "axios";

const ArmstrongVerification = () => {
  const [number, setNumber] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    try {
      const response = await axios.post("http://localhost:8080/armstrong/verify", {
        user_id: parseInt(userId),
        number: parseInt(number),
      });
      setMessage(`Armstrong number saved: ${response.data.number}`);
    } catch (error) {
      setMessage("Error: " + error.response?.data || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Verify Armstrong Number</h1>
        <div className="space-y-4">
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your user ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter a number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleVerify}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Verify
          </button>
        </div>
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default ArmstrongVerification;

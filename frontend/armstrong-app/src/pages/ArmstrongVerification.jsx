import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ArmstrongVerification = () => {
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [isArmstrong, setIsArmstrong] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate("/"); // Redirect to sign-in/register if no email is found
    }
  }, [email, navigate]);

  const handleVerify = async () => {
    setError("");
    setMessage("");
    setIsArmstrong(false);

    if (!number) {
      setError("Number is required");
      return;
    }

    if (number <= 0) {
      setError("Number must be a positive integer");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/armstrong/verify", {
        email,
        number: parseInt(number),
      });

      if (response.data.isArmstrong) {
        setMessage(`Number ${number} is an Armstrong number.`);
        setIsArmstrong(true);
      } else {
        setMessage(`Number ${number} is not an Armstrong number.`);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    }
  };

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8080/armstrong/save", {
        email,
        number: parseInt(number),
      });
      setMessage(`Armstrong number ${number} saved successfully.`);
      setIsArmstrong(false);
    } catch (err) {
      setError(err.response?.data?.error || "Save failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 p-6">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Armstrong Number Verification
        </h1>
        <p className="text-center text-gray-600 mb-6">Logged in as: {email}</p>
        <div className="space-y-5">
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700">
              Number
            </label>
            <input
              id="number"
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter a number"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            onClick={handleVerify}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Verify
          </button>
          {isArmstrong && (
            <button
              onClick={handleSave}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-4"
            >
              Save Number
            </button>
          )}
        </div>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default ArmstrongVerification;

import React, { useState, useEffect } from "react";
import axios from "axios";
 

const UserDashboard = () => {
  const [numbers, setNumbers] = useState([]);
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNumbers = async () => {
      if (!email) return;

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching numbers..."); // Debugging
        const response = await axios.get("http://localhost:8080/user-dashboard", {
          params: { email },
        });
        setNumbers(response.data.numbers); // Replace numbers instead of appending
      } catch (err) {
        console.error("Error fetching numbers:", err.message);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNumbers();
  }, [email]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
       
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white border-t-8 border-[#17408B] p-8 rounded-lg shadow-lg w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-center text-[#17408B] mb-4">
            User Dashboard
          </h1>
          <p className="text-center text-gray-600 mb-6">
            <span className="font-semibold text-gray-800">User:</span> {email}
          </p>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : numbers.length > 0 ? (
            <ul className="bg-[#D6E4F0] shadow-inner rounded-lg divide-y divide-gray-300">
              {numbers.map((number, index) => (
                <li
                  key={index}
                  className="px-4 py-3 text-gray-800 flex justify-between items-center"
                >
                  <span className="font-medium">{index + 1}.</span>
                  <span className="text-lg font-semibold">{number.number}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              No Armstrong numbers available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

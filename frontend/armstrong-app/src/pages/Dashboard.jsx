import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = ({ userId }) => {
  const [numbers, setNumbers] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchNumbers = async () => {
      const response = await axios.get(
        `http://localhost:8080/armstrong/user/${userId}?page=${page}&size=10`
      );
      setNumbers(response.data);
    };
    fetchNumbers();
  }, [userId, page]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">Your Armstrong Numbers</h1>
        <ul className="space-y-2">
          {numbers.map((num) => (
            <li
              key={num.id}
              className="border border-gray-300 rounded-md px-4 py-2"
            >
              {num.number}
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

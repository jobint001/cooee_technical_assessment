import React, { useState, useEffect } from "react";
import axios from "axios";

const GlobalDashboard = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(
        `http://localhost:8080/armstrong/global?page=${page}&size=10&query=${query}`
      );
      setUsers(response.data.data);
    };
    fetchUsers();
  }, [page, query]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-6">Global Dashboard</h1>
        <input
          type="text"
          placeholder="Filter by email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.id}>
              <p className="font-bold">{user.email}</p>
              <ul className="ml-4">
                {user.numbers.map((num) => (
                  <li
                    key={num.id}
                    className="border border-gray-300 rounded-md px-4 py-2"
                  >
                    {num.number}
                  </li>
                ))}
              </ul>
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

export default GlobalDashboard;

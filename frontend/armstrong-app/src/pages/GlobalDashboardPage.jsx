import React, { useState, useEffect } from "react";
import axios from "axios";


const GlobalDashboard = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(
        `http://localhost:8080/armstrong/global?page=${page}&size=6&query=${query}`
      );
      setUsers(response.data.data);
    };
    fetchUsers();
  }, [page, query]);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
     
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#1E3A8A]">Global Dashboard</h1>
          <input
            type="text"
            placeholder="Filter by email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] shadow-sm text-sm"
          />
        </div>

        {/* User List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="bg-white shadow-lg rounded-lg p-4 hover:shadow-2xl transition duration-300 border-t-8 border-[#17408B] flex flex-col h-72 overflow-hidden"
              >
                <p className="text-lg font-semibold text-[#17408B] mb-4 truncate">
                  {user.email}
                </p>
                <div className="overflow-y-auto flex-grow border border-gray-200 rounded-md bg-[#D6E4F0] p-2">
                  {user.numbers.length > 0 ? (
                    <ul className="space-y-2">
                      {user.numbers.map((num, index) => (
                        <li
                          key={num.id}
                          className="border border-gray-300 rounded-md px-3 py-2 text-center text-gray-700 bg-white flex items-center justify-between"
                        >
                          <span className="font-medium">{index + 1}.</span>
                          <span>{num.number}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 text-center">
                      No numbers available
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-10 col-span-full">
              No users found. Try adjusting the filter.
            </p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="bg-[#17408B] text-white py-2 px-4 rounded-md hover:bg-[#102C5B] transition duration-300 disabled:bg-gray-300"
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-[#17408B] text-white py-2 px-4 rounded-md hover:bg-[#102C5B] transition duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalDashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination";

const GlobalDashboard = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(
        `http://localhost:8080/armstrong/global?page=${page}&size=10&query=${query}`
      );
      setUsers(response.data.data);
      setTotalPages(response.data.totalPages);
    };
    fetchUsers();
  }, [page, query]);

  return (
    <div>
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
          <li key={user.id} className="border border-gray-300 rounded-md p-4">
            <p className="font-bold">{user.email}</p>
            <ul className="ml-4 space-y-2">
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
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default GlobalDashboard;

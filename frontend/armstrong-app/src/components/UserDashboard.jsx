import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination";

const UserDashboard = ({ userId }) => {
  const [numbers, setNumbers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNumbers = async () => {
      const response = await axios.get(
        `http://localhost:8080/armstrong/user/${userId}?page=${page}&size=10`
      );
      setNumbers(response.data.numbers);
      setTotalPages(response.data.totalPages);
    };
    fetchNumbers();
  }, [userId, page]);

  return (
    <div>
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
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default UserDashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";

const Navbar = () => {
  return (
    <nav className="bg-[#17408B] p-4 shadow-md border-b border-[#102C5B] flex justify-between items-center">
      <div className="text-[#F8F9FA] font-bold text-lg">ArmstrongCheck</div>
      <ul className="flex space-x-6 text-[#F8F9FA] font-medium text-sm">
        <li>
          <a href="/" className="hover:text-[#A9C8E8] transition duration-300">
            Register
          </a>
        </li>
        <li>
          <a href="/login" className="hover:text-[#A9C8E8] transition duration-300">
            Login
          </a>
        </li>
        <li>
          <a href="/verify" className="hover:text-[#A9C8E8] transition duration-300">
            Verify Armstrong
          </a>
        </li>
        <li>
          <a href="/dashboard" className="hover:text-[#A9C8E8] transition duration-300">
            User Dashboard
          </a>
        </li>
        <li>
          <a href="/global" className="hover:text-[#A9C8E8] transition duration-300">
            Global Dashboard
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
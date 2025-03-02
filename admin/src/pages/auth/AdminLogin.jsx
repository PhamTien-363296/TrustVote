import React, { useState } from "react";
import { FaUserShield } from "react-icons/fa";
import axios from "axios";

export const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", matKhau: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/auth/login", credentials);
      alert("Đăng nhập thành công!");
      console.log(response.data);
      // Chuyển hướng hoặc xử lý sau đăng nhập
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Lỗi đăng nhập. Vui lòng thử lại!");
      } else {
        setError("Lỗi không xác định. Vui lòng thử lại sau!");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://i.pinimg.com/736x/2e/3d/68/2e3d6845011de0d24c13dd1e1028a2ff.jpg')" }}>
      <div className="bg-white/20 backdrop-blur-md p-10 rounded-2xl shadow-xl w-[420px] text-center border border-white/30 relative">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/30 p-4 rounded-full shadow-lg">
          <FaUserShield className="text-gray-800 text-4xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mt-6 mb-6">Admin Login</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-3 bg-white/20 border border-white/30 rounded-lg w-full text-gray-800 placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="matKhau"
            placeholder="Mật khẩu"
            className="p-3 bg-white/20 border border-white/30 rounded-lg w-full text-gray-800 placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-white/30 text-gray-800 rounded-lg hover:bg-opacity-40 transition font-semibold text-lg shadow-md"
          >
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

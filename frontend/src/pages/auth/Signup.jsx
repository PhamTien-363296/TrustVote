import React, { useState } from "react";
import axios from "axios"; 
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", matKhau: "" });
  const [error, setError] = useState(""); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/auth/signup", form); 
      alert("Đăng ký thành công!");
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Lỗi đăng ký. Vui lòng thử lại!");
      } else {
        setError("Lỗi không xác định. Vui lòng thử lại sau!");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500/40">
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-2xl w-96 backdrop-blur-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Đăng Ký</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>} 
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium text-left">Username</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 focus-within:ring-2 ring-blue-400">
              <FaUser className="text-gray-500" />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full pl-2 outline-none bg-transparent"
                placeholder="Nhập username"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium text-left">Email</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 focus-within:ring-2 ring-blue-400">
              <FaEnvelope className="text-gray-500" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-2 outline-none bg-transparent"
                placeholder="Nhập email"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium text-left">Mật Khẩu</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 focus-within:ring-2 ring-blue-400">
              <FaLock className="text-gray-500" />
              <input
                type="password"
                name="matKhau" 
                value={form.matKhau} 
                onChange={handleChange}
                className="w-full pl-2 outline-none bg-transparent"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg transition font-semibold shadow-md"
          >
            Đăng Ký
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Bạn đã có tài khoản? <a href="/login" className="text-purple-500 hover:underline">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
};

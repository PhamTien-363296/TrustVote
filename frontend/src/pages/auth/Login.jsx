import React, { useState } from "react";
import axios from "axios";
import {  FaLock } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [form, setForm] = useState({ cccd: "", matKhau: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/cutri/login", form);
      alert("Đăng nhập thành công!");
      if (response.data) {
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Lỗi đăng nhập. Vui lòng thử lại!");
      } else {
        setError("Lỗi không xác định. Vui lòng thử lại sau!");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-700 to-blue-700/50">
      <div className="bg-gradient-to-br from-white to-gray-100 bg-opacity-90 p-8 rounded-2xl shadow-2xl w-96 backdrop-blur-lg border border-gray-300">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-900">Đăng Nhập</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>} 
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium text-left">Căn cước công dân (CCCD) <span className='text-red-500'>*</span></label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 focus-within:ring-2 ring-blue-400">
              <FaAddressCard className="text-gray-500" />
              <input
                type="text"
                name="cccd"
                value={form.cccd}
                onChange={handleChange}
                className="w-full pl-2 outline-none bg-transparent"
                placeholder="Nhập cccd"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium text-left">Mật Khẩu <span className='text-red-500'>*</span></label>
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
            className="w-full cursor-pointer bg-blue-800 text-white py-2 rounded-lg hover:opacity-90 transition font-semibold shadow-md"
          >
            Đăng Nhập
          </button>
        </form>
        <button
            className="mt-4 w-full border border-blue-800 text-blue-800 py-2 rounded-lg hover:opacity-90 transition font-semibold shadow-md hover:bg-gray-200"
          >
          <a href="/activate-account">Kích hoạt tài khoản</a>
        </button>
      </div>
    </div>
  );
};

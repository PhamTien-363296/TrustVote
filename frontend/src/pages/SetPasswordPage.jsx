import { useState } from "react";
import axios from "axios";
import {  FaLock } from "react-icons/fa";
import { useLocation } from "react-router-dom";

function SetPasswordPage() {
    const [matKhau, setMatKhau] = useState("");
    const [matKhau2, setMatKhau2] = useState("");
    const location = useLocation();
    const { cccd } = location.state || {};

    const [error, setError] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if(matKhau !== matKhau2){
            setError("Hình như hai mật khẩu này đang giận nhau rồi! Nhập lại cho khớp nào 😘");
            return;
        }
        try {
            const response = await axios.put("/api/cutri/capNhatMatKhau",{ cccd: cccd, matKhau: matKhau } );
            if (response.status === 200) {
                window.location.href = "/";
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Lỗi thiết lập mật khẩu. Vui lòng thử lại!");
            } else {
                setError("Lỗi không xác định. Vui lòng thử lại sau!");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-700">
            <div className="bg-gradient-to-br from-white to-gray-100 bg-opacity-90 p-8 rounded-2xl shadow-2xl w-96 backdrop-blur-lg border border-gray-300">
                <h2 className="text-3xl font-bold text-center text-blue-900">Thiết lập mật khẩu</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>} 
                <form onSubmit={handleSubmit} className="mt-5">
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2 font-medium text-left">Mật khẩu <span className='text-red-500'>*</span></label>
                        <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 focus-within:ring-2 ring-blue-400">
                        <FaLock className="text-gray-500" />
                        <input
                            type="password"
                            name="matKhau" 
                            value={matKhau}
                            onChange={(e) => setMatKhau(e.target.value)}
                            className="w-full pl-2 outline-none bg-transparent"
                            placeholder="Nhập mật khẩu"
                            required
                        />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2 font-medium text-left">Nhập lại bật khẩu <span className='text-red-500'>*</span></label>
                        <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 focus-within:ring-2 ring-blue-400">
                        <FaLock className="text-gray-500" />
                        <input
                            type="password"
                            name="matKhau2" 
                            value={matKhau2}
                            onChange={(e) => setMatKhau2(e.target.value)}
                            className="w-full pl-2 outline-none bg-transparent"
                            placeholder="Nhập lại mật khẩu"
                            required
                        />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-800 cursor-pointer text-white py-2 rounded-lg hover:opacity-90 transition font-semibold shadow-md"
                    >
                        Xác nhận
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SetPasswordPage
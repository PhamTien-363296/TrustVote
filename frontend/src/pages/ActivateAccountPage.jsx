import React, { useState } from "react";
import axios from "axios";
import { CgMail } from "react-icons/cg";
import { FaAddressCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ActivateAccountPage() {
    const [cccd, setCccd] = useState("");
    const [gmail, setGmail] = useState("");

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!cccd.trim()) {
            setError("Vui lòng nhập CCCD");
            return;
        }

        if (!gmail.trim()) {
            setError("Vui lòng nhập Gmail!");
            return;
        }
    
        try {
        const response = await axios.get(`/api/cutri/layTheoCCCD/${cccd}`);

        if (response.status === 200) {
            navigate("/authorize-otp", { state: { cccd, gmail } });
        } else if (response.status === 400 || response.status === 404) {
            setError(response.data.message);
        }
        
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Lỗi không xác định từ server!");
            } else if (error.request) {
                setError("Không thể kết nối đến server. Vui lòng kiểm tra mạng!");
            } else {
                setError("Lỗi hệ thống. Vui lòng thử lại!");
            }
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-700">
            <div className="bg-gradient-to-br from-white to-gray-100 bg-opacity-90 p-8 rounded-2xl shadow-2xl w-96 backdrop-blur-lg border border-gray-300">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-900">Kích hoạt tài khoản</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>} 
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium text-left">Căn cước công dân (CCCD) <span className='text-red-500'>*</span></label>
                <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 focus-within:ring-2 ring-blue-400">
                    <FaAddressCard className="text-gray-500" />
                    <input
                    type="text"
                    name="cccd"
                    value={cccd}
                    onChange={(e) => setCccd(e.target.value)}
                    className="w-full pl-2 outline-none bg-transparent"
                    placeholder="Nhập cccd"
                    required
                    />
                </div>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-medium text-left">Gmail <span className='text-red-500'>*</span></label>
                    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 focus-within:ring-2 ring-blue-400">
                        <CgMail className="text-gray-500" />
                        <input
                        type="email"
                        name="gmail" 
                        value={gmail}
                        onChange={(e) => setGmail(e.target.value)}
                        className="w-full pl-2 outline-none bg-transparent"
                        placeholder="Nhập gmail"
                        required
                        />
                    </div>
                </div>
                <button
                type="submit"
                className="w-full bg-blue-800 cursor-pointer text-white py-2 rounded-lg hover:opacity-90 transition font-semibold shadow-md"
                >
                Gửi yêu cầu
                </button>
            </form>
            </div>
        </div>
    )
}

export default ActivateAccountPage
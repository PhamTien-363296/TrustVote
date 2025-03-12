import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthorizePage = () => {
    const [otp, setOTP] = useState("");
    const [otpToken, setOtpToken] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const location = useLocation();
    const { cccd, gmail } = location.state || {};

    const [thoiGian, setThoiGian] = useState(60);
    
    // Hàm gửi OTP
    const sendOTP = async (gmail) => {
        if (!gmail) {
            console.error("Không có email để gửi OTP.");
            return;
        }

        try {
            const res = await axios.post("/api/cutri/guiOTP", { email: gmail });
            // console.log("token", res.data.otpToken)
            // console.log("OTP Response:", res.data);
            setOtpToken(res.data.otpToken)
            setThoiGian(60);
        } catch (error) {
            console.error("Lỗi gửi OTP:", error.response?.data || error.message);
            setError("Lỗi gửi OTP. Vui lòng thử lại sau!");
        }
    };

    useEffect(() => {
        if (gmail) {
            sendOTP(gmail);
        }
    }, [gmail]);

    useEffect(() => {
        if (thoiGian > 0) {
            const timer = setTimeout(() => setThoiGian(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [thoiGian]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post("/api/cutri/xacthucOTP", { otpToken, otp });
            //alert("Xác thực thành công!");
            // console.log(response.data);
            if (response.data) {
                navigate("/set-password", { state: { cccd } });
            } else {
                setError("OTP của bạn chưa đúng!");
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Lỗi xác thực. Vui lòng thử lại!");
            } else {
                setError("Lỗi không xác định. Vui lòng thử lại sau!");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-700">
            <div className="bg-gradient-to-br from-white to-gray-100 bg-opacity-90 p-8 rounded-2xl shadow-2xl w-96 backdrop-blur-lg border border-gray-300">
                <h2 className="text-3xl font-bold text-center text-blue-900">Xác thực mã OTP</h2>
                <p className="text-center mb-6 text-gray-800">Vui lòng nhập mã OTP vừa gửi đến gmail</p>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>} 
                <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 focus-within:ring-2 ring-blue-400">
                    <input
                        type="text"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOTP(e.target.value)}
                        className="w-full pl-2 outline-none bg-transparent"
                        placeholder="Nhập OTP"
                        required
                    />
                    </div>
                </div>
                {thoiGian > 0 ? (
                        <p className="text-center text-gray-600">Vui lòng nhập mã OTP trong {thoiGian} giây.</p>
                    ) : (
                        <button
                            type="button"
                            onClick={() => sendOTP(gmail)}
                            className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                        >
                            Gửi lại OTP
                        </button>
                    )}
                <button
                    type="submit"
                    className="w-full bg-blue-800 cursor-pointer text-white py-2 rounded-lg hover:opacity-90 transition font-semibold shadow-md"
                >
                    Xác thực
                </button>
                </form>
            </div>
        </div>
    );
};

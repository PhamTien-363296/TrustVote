import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaUser } from "react-icons/fa";

function ResultPage() {
    const location = useLocation();
    const { idDonViBauCu } = location.state || {}; 
    const [matKhau, setMatKhau] = useState("");
    const [hienNhapKey, setHienNhapKey] = useState(true);
    const [winners, setWinners] = useState([]); 

    useEffect(() => {
        if (!idDonViBauCu) {
            alert("Không tìm thấy đơn vị bầu cử!");
        }
    }, [idDonViBauCu]);

    const layKetQua = async () => {
        if (!matKhau.trim()) {
            alert("Vui lòng nhập mật khẩu!");
            return;
        }
        try {
            const res = await axios.get(`/api/donvi/layKetQua?matKhau=${matKhau}&idDonViBauCu=${idDonViBauCu}`);

            if (res.data.winners.length === 0) {
                alert("Chưa có kết quả bầu cử!");
                return;
            }

            setWinners(res.data.winners);
            setHienNhapKey(false);
        } catch (err) {
            console.error("Lỗi khi lấy kết quả:", err);
            alert("Lấy kết quả thất bại! Kiểm tra lại mật khẩu.");
        }
    };

    return (
        <div className="bg-gray-100 w-full min-h-screen flex flex-col">
            <div className="bg-blue-900 w-full flex items-center justify-between p-4 shadow-md">
                <h2 className="text-white font-bold text-lg">Kết quả bầu cử</h2>
                <button className="bg-amber-200 p-3 rounded-full hover:bg-amber-300 transition-all">
                    <FaUser className="text-blue-900 text-lg" />
                </button>
            </div>

            <div className="flex-grow p-6">
                {hienNhapKey && (
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-800">Nhập mật khẩu để xem kết quả</h3>
                        <input
                            type="password"
                            value={matKhau}
                            onChange={(e) => setMatKhau(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
                            placeholder="Nhập mật khẩu..."
                        />
                        <button
                            onClick={layKetQua}
                            className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
                        >
                            Xác nhận
                        </button>
                    </div>
                )}

                {!hienNhapKey && winners.length > 0 && (
                    <div className="bg-white p-4 rounded-lg shadow-lg mt-6">
                        <h3 className="text-xl font-semibold text-gray-800">Kết quả bầu cử</h3>
                        <div className="mt-4">
                            {winners.map((winner, index) => (
                                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-md mb-4">
                                    <p className="text-lg font-medium text-gray-800">{winner.hoVaTen}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResultPage;

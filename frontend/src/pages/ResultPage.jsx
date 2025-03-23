import React from 'react'
import { FaUser } from 'react-icons/fa'

function ResultPage() {
    return (
        <div className="bg-gray-100 w-full min-h-screen flex flex-col">
            <div className="bg-blue-900 w-full flex items-center justify-between p-4 shadow-md">
                <h2 className="text-white font-bold text-lg">Kết quả bầu cử</h2>
                <button className="bg-amber-200 p-3 rounded-full hover:bg-amber-300 transition-all">
                    <FaUser className="text-blue-900 text-lg" />
                </button>
            </div>

            <div className="flex-grow p-6">
                <div className="text-center mb-6">
                    <h1 className="font-black text-3xl text-blue-900">
                        Bầu cử đại biểu Quốc hội khóa XII và đại biểu HĐND
                    </h1>
                    <h3 className="font-semibold text-lg text-gray-700 mt-2">
                        DANH SÁCH CHÍNH THỨC NHỮNG NGƯỜI ỨNG CỬ ĐẠI BIỂU KHOÁ XV THEO TỪNG
                        ĐƠN VỊ BẦU CỬ TRONG CẢ NƯỚC
                    </h3>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-800">Kết quả bầu cử</h3>
                    <div className="mt-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-md mb-4">
                            <p className="text-lg font-medium text-gray-800">Ứng Cử Viên A</p>
                            <p className="text-lg font-medium text-blue-600">75%</p>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-md mb-4">
                            <p className="text-lg font-medium text-gray-800">Ứng Cử Viên B</p>
                            <p className="text-lg font-medium text-blue-600">20%</p>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-md mb-4">
                            <p className="text-lg font-medium text-gray-800">Ứng Cử Viên C</p>
                            <p className="text-lg font-medium text-blue-600">5%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResultPage

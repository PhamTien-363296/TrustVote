import React from 'react'
import MainLayout from '../layouts/MainLayout'
import { useNavigate } from "react-router-dom";
// import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const electionData = [
    { id: 1, name: 'Bầu cử đại biểu Quốc hội khóa XII và đại biểu Hội đồng nhân dân (HĐND)', startDate: '05/03/2025', endDate: '05/05/2025', status: 'Đã xác nhận' },
    { id: 2, name: 'Bầu cử đại biểu Quốc hội khóa XIII và đại biểu Hội đồng nhân dân (HĐND)', startDate: '10/04/2025', endDate: '10/06/2025', status: 'Đã xác nhận' },
    { id: 3, name: 'Bầu cử đại biểu Quốc hội khóa XIV và đại biểu Hội đồng nhân dân (HĐND)', startDate: '15/05/2025', endDate: '15/07/2025', status: 'Đã xác nhận' },
    { id: 4, name: 'Bầu cử đại biểu Quốc hội khóa XV và đại biểu Hội đồng nhân dân (HĐND)', startDate: '20/06/2025', endDate: '20/08/2025', status: 'Chưa xác nhận' },
    { id: 1, name: 'Bầu cử đại biểu Quốc hội khóa XII và đại biểu Hội đồng nhân dân (HĐND)', startDate: '05/03/2025', endDate: '05/05/2025', status: 'Đã xác nhận' },
    { id: 2, name: 'Bầu cử đại biểu Quốc hội khóa XIII và đại biểu Hội đồng nhân dân (HĐND)', startDate: '10/04/2025', endDate: '10/06/2025', status: 'Đã xác nhận' },
    { id: 3, name: 'Bầu cử đại biểu Quốc hội khóa XIV và đại biểu Hội đồng nhân dân (HĐND)', startDate: '15/05/2025', endDate: '15/07/2025', status: 'Đã xác nhận' },
    { id: 4, name: 'Bầu cử đại biểu Quốc hội khóa XV và đại biểu Hội đồng nhân dân (HĐND)', startDate: '20/06/2025', endDate: '20/08/2025', status: 'Chưa xác nhận' },
    { id: 1, name: 'Bầu cử đại biểu Quốc hội khóa XII và đại biểu Hội đồng nhân dân (HĐND)', startDate: '05/03/2025', endDate: '05/05/2025', status: 'Đã xác nhận' },
    { id: 2, name: 'Bầu cử đại biểu Quốc hội khóa XIII và đại biểu Hội đồng nhân dân (HĐND)', startDate: '10/04/2025', endDate: '10/06/2025', status: 'Đã xác nhận' },
    { id: 3, name: 'Bầu cử đại biểu Quốc hội khóa XIV và đại biểu Hội đồng nhân dân (HĐND)', startDate: '15/05/2025', endDate: '15/07/2025', status: 'Đã xác nhận' },
    { id: 3, name: 'Bầu cử đại biểu Quốc hội khóa XIV và đại biểu Hội đồng nhân dân (HĐND)', startDate: '15/05/2025', endDate: '15/07/2025', status: 'Đã xác nhận' },
];


function ElectionPage() {
    const navigate = useNavigate();
    const page = 1;
    const tongPages = 1;
    
    const handlePageChange = (newPage) => {
        const searchParams = new URLSearchParams(location.search);
            searchParams.set("trang", newPage);

        navigate(`${location.pathname}?${searchParams.toString()}`);
    };
    return (
        <MainLayout>
            <div className='w-full h-full p-3'>
                <div className='flex justify-between items-center mb-3 cursor-pointer'>
                    <h1 className='text-blue-950 text-4xl font-extrabold'>DANH SÁCH ĐỢT BẦU CỬ</h1>
                    <div className='rounded-full shadow-lg px-7 py-3 bg-blue-950 text-white w-fit font-medium 
                    hover:bg-blue-800 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out'>
                        Thêm
                    </div>
                </div>
                <div className='border-2 border-blue-950'>
                    <div className='w-full bg-blue-950 text-white grid grid-cols-12 items-center font-semibold'>
                        <div className='col-span-1 text-center border-r py-4 uppercase'>STT</div>
                        <div className='col-span-6 border-r py-4 text-center uppercase'>Tên đợt bầu cử</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Ngày bắt đầu</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Ngày kết thúc</div>
                        <div className='col-span-1 py-4 text-center uppercase'>Trạng thái</div>
                    </div>
                    {electionData.map((election, index) => (
                        <div key={election.id} className='w-full shadow-md grid grid-cols-12 items-center border-b odd:bg-gray-100 even:bg-white'>
                            <div className='col-span-1 text-center border-r py-4'>{index + 1}</div>
                            <div className='col-span-6 border-r py-4 text-center'>{election.name}</div>
                            <div className='col-span-2 border-r py-4 text-center'>{election.startDate}</div>
                            <div className='col-span-2 border-r py-4 text-center'>{election.endDate}</div>
                            <div className='col-span-1 py-4 text-center'>
                                {election.status === 'Chưa xác nhận' ? (
                                    <button className='bg-orange-600 text-white text-sm font-medium px-3 py-1 rounded-md cursor-pointer
                                    hover:bg-orange-700 transition-all duration-300 ease-in-out shadow-md'>
                                        Xác nhận
                                    </button>
                                ) : (
                                    <span className='text-green-600 font-medium'>{election.status}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center mt-3">
                    <button 
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className={`h-10 w-10 items-center flex justify-center mx-1 rounded-xl shadow hover:bg-blue-950 hover:text-white transition duration-200 ${page === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}`}>
                        <FaAngleLeft />
                    </button>
                    {Array.from({ length: tongPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`h-10 w-10 items-center flex justify-center mx-1 rounded-xl shadow hover:bg-blue-950 hover:text-white transition duration-200 ${page === index + 1 ? 'bg-blue-950 text-white' : 'bg-white'}`}>
                            {index + 1}
                        </button>
                    ))}
                    <button 
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === tongPages}
                        className={`h-10 w-10 items-center flex justify-center mx-1 rounded-xl shadow hover:bg-blue-950 hover:text-white transition duration-200 ${page === tongPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}`}>
                        <FaAngleRight />
                    </button>
                </div>
            </div>
        </MainLayout>
    )
}

export default ElectionPage

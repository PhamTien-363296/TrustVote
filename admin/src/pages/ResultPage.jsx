import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';

function ResultPage() {
    const [selectedElection, setSelectedElection] = useState('');
    const [electionData, setElectionData] = useState([
        { id: 1, code: 'EL2024', name: 'Bầu cử Hội đồng 2024', startDate: '2024-01-15' },
        { id: 2, code: 'EL2023', name: 'Bầu cử Hội đồng 2023', startDate: '2023-01-10' },
    ]);

    return (
        <MainLayout>
            <div className='w-full h-full p-3'>
                <div className='flex justify-between items-center mb-3'>
                    <h1 className='text-blue-950 text-4xl font-extrabold'>KẾT QUẢ BẦU CỬ</h1>
                    <select
                        className="rounded-full shadow-lg px-4 py-2 border border-blue-950 text-blue-950 font-medium cursor-pointer hover:bg-blue-950 hover:text-white"
                        value={selectedElection}
                        onChange={(e) => setSelectedElection(e.target.value)}
                    >
                        <option value="" disabled>Chọn đợt bầu cử</option>
                        {electionData.map((election) => (
                            <option key={election.id} value={election.id}>{election.name}</option>
                        ))}
                    </select>
                </div>
                <div className='border-2 border-blue-950 rounded-lg overflow-hidden'>
                    <div className='w-full bg-blue-950 text-white grid grid-cols-4 items-center font-semibold'>
                        <div className='text-center border-r py-4 uppercase'>#</div>
                        <div className='text-center border-r py-4 uppercase'>Mã</div>
                        <div className='text-center border-r py-4 uppercase'>Tên đợt bầu cử</div>
                        <div className='text-center py-4 uppercase'>Ngày bắt đầu</div>
                    </div>
                    {electionData.map((election, index) => (
                        <div key={election.id} className='grid grid-cols-4 items-center text-center border-t border-blue-950 p-4 hover:bg-gray-100'>
                            <div className='border-r'>{index + 1}</div>
                            <div className='border-r'>{election.code}</div>
                            <div className='border-r'>{election.name}</div>
                            <div>{election.startDate}</div>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}

export default ResultPage;
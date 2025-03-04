import React from 'react'
import MainLayout from '../layouts/MainLayout'

function ElectionUnitsPage() {
    return (
        <MainLayout>
            <div className='w-full h-full p-3'>
                <div className='flex justify-between items-center mb-3 cursor-pointer'>
                    <h1 className='text-blue-950 text-4xl font-extrabold'>DANH SÁCH ĐƠN VỊ BẦU CỬ</h1>
                    <div className='rounded-full shadow-lg px-7 py-3 bg-blue-950 text-white w-fit font-medium 
                    hover:bg-blue-800 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out'>
                        Thêm
                    </div>
                </div>
                <div className='border-2 border-blue-950'>
                    <div className='w-full bg-blue-950 text-white grid grid-cols-12 items-center font-semibold'>
                        <div className='col-span-1 text-center border-r py-4 uppercase'>STT</div>
                        <div className='col-span-3 border-r py-4 text-center uppercase'>Tên đơn vị</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Tỉnh thành</div>
                        <div className='col-span-4 border-r py-4 text-center uppercase'>Quận huyện</div>
                        <div className='col-span-1 border-r  py-4 text-center uppercase'>Số đại biểu</div>
                        <div className='col-span-1 py-4 text-center uppercase'>Trạng thái</div>
                    </div>
                    
                </div>
            </div>
        </MainLayout>
    )
}

export default ElectionUnitsPage
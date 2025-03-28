import React from 'react'
import MainLayout from '../layouts/MainLayout'
import { useNavigate } from "react-router-dom";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useState, useEffect } from 'react';
import { MdClose } from "react-icons/md";
import axios from "axios";
import moment from "moment";
import { useAuth } from '../context/AuthContext2';

function ElectionPage() {
    const { user } = useAuth();

    const navigate = useNavigate();
    const page = 1;
    const tongPages = 1;

    const [moThem, setMoThem] = useState(false)
    const [dotBauCu, setDotBauCu] = useState({
        tenDotBauCu: "",
        ngayBatDau: "",
        ngayKetThuc: ""
    });

    const [dotBauCuList, setDotBauCuList] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log("đợt bầu cử", dotBauCuList);
    console.log("user", user);

    useEffect(() => {
        const fetchDotBauCu = async () => {
            try {
                const response = await axios.get("/api/dotbaucu/lay");
                //console.log(response.data)
                setDotBauCuList(response.data);
            } catch (err) {
                setError("Lỗi khi tải dữ liệu!");
                console.error("Lỗi API:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDotBauCu();
    }, []);

    if (loading) return <MainLayout><p>Đang tải...</p></MainLayout>;
    if (error) return <MainLayout>{error}</MainLayout>;

    const handlePageChange = (newPage) => {
        const searchParams = new URLSearchParams(location.search);
            searchParams.set("trang", newPage);

        navigate(`${location.pathname}?${searchParams.toString()}`);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDotBauCu((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post("/api/dotbaucu/them", {
                tenDotBauCu: dotBauCu.tenDotBauCu,
                ngayBatDau: new Date(dotBauCu.ngayBatDau),
                ngayKetThuc: new Date(dotBauCu.ngayKetThuc),
            });
    
            if (response.status === 201) {
                setDotBauCuList((prev) => [...prev, response.data.dotBauCu]);
                setMoThem(false);
                setDotBauCu({
                    tenDotBauCu: "",
                    ngayBatDau: "",
                    ngayKetThuc: ""
                });
                alert("Thêm đợt bầu cử thành công!");
                window.location.reload();
            } else {
                alert("Có lỗi xảy ra!");
            }
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
            alert("Lỗi khi gửi dữ liệu lên server!");
        }
    };

    
    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa đợt bầu cử này?");
        if (!isConfirmed) return;
    
        try {
            const response = await axios.delete(`/api/dotbaucu/xoa/${id}`);
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            alert(error.response?.data?.message || "Lỗi khi xóa cử tri!");
        }
    };
    
    const handleUpdate = async (id, trangThaiMoi) => {
        const privateKey = prompt("Vui lòng nhập private key để duyệt:");
        if (!privateKey) {
            alert("Bạn cần nhập private key để duyệt!");
            return;
        }
    
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn cập nhật đợt này?");
        if (!isConfirmed) return;
    
        // Chuyển trạng thái thành boolean
        const chapThuan = trangThaiMoi === "Chưa diễn ra";
    
        try {
            const response = await axios.post(`/api/dotbaucu/xetduyet/${id}`, { chapThuan, privateKey });
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert(error.response?.data?.message || "Lỗi khi cập nhật đợt bầu cử!");
        }
    };

    const handleUpdateBDvaKT = async (id, trangThaiMoi) => {
        const privateKey = prompt("Vui lòng nhập private key để duyệt:");
        if (!privateKey) {
            alert("Bạn cần nhập private key để duyệt!");
            return;
        }
        
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn cập nhật đợt này?");
        if (!isConfirmed) return;
        
        try {
            const response = await axios.put(`/api/dotbaucu/capnhat/${id}`, { trangThaiMoi, privateKey });
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert(error.response?.data?.message || "Lỗi khi cập nhật đợt bầu cử!");
        }
    };

    return (
        <MainLayout>
            <div className='w-full h-full p-3'>
                <div className='flex justify-between items-center mb-3 cursor-pointer'>
                    <h1 className='text-blue-950 text-4xl font-extrabold'>DANH SÁCH ĐỢT BẦU CỬ</h1>
                    {user?.roleND  === "ELECTION_CREATOR" && (
                        <div className='rounded-full shadow-lg px-7 py-3 bg-blue-950 text-white w-fit font-medium hover:bg-blue-800 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out'
                            onClick={() => setMoThem(true)}>
                            Thêm
                        </div>
                    )}
                </div>
                <div className='border-2 border-blue-950'>
                    <div className='w-full bg-blue-950 text-white grid grid-cols-20 items-center font-semibold'>
                        <div className='col-span-1 text-center border-r py-4 uppercase'>#</div>
                        <div className='col-span-2 text-center border-r py-4 uppercase'>Mã</div>
                        <div className='col-span-7 border-r py-4 text-center uppercase'>Tên đợt bầu cử</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Ngày bắt đầu</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Ngày kết thúc</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Người tạo</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Người duyệt</div>
                        <div className='col-span-2 py-4 text-center uppercase'>Trạng thái</div>
                    </div>
                    {dotBauCuList.map((election, index) => (
                        <div key={election._id} className='w-full shadow-md grid grid-cols-20 items-center border-b odd:bg-gray-100 even:bg-white'>
                            <div className='col-span-1 text-center border-r py-4'>{index + 1}</div>
                            <div className='col-span-2 text-center border-r py-4 uppercase'>{election.maDotBauCu}</div>
                            <div className='col-span-7 border-r py-4 text-center'>{election.tenDotBauCu}</div>
                            <div className='col-span-2 border-r py-4 text-center'>{moment(election.ngayBatDau).format("DD/MM/YYYY HH:mm:ss")}</div>
                            <div className='col-span-2 border-r py-4 text-center'>{moment(election.ngayKetThuc).format("DD/MM/YYYY HH:mm:ss")}</div>
                            <div className='col-span-2 border-r py-4 text-center'>{election.idNguoiTao.username}</div>
                            <div className='col-span-2 border-r py-4 text-center'>
                                {election?.idNguoiDuyet?.username ? (
                                    election.idNguoiDuyet.username
                                ) : (
                                    <span className="text-gray-400">Chưa ai duyệt</span>
                                )}
                            </div>

                            <div className='col-span-2 py-4 text-center'>
                            {user?.roleND === "ADMIN" && election.trangThai === "Chờ xét duyệt" ? (
                                <div className="flex gap-1 justify-center items-center">
                                    <button className="bg-green-600 text-white text-sm font-medium px-2 py-1 rounded-md cursor-pointer 
                                        hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md"
                                        onClick={() => handleUpdate(election._id, "Chưa diễn ra")}>
                                        Duyệt
                                    </button>
                                    <button className="bg-red-600 text-white text-sm font-medium px-2 py-1 rounded-md cursor-pointer 
                                        hover:bg-red-700 transition-all duration-300 ease-in-out shadow-md"
                                        onClick={() => handleUpdate(election._id, "Từ chối")}>
                                        Từ chối
                                    </button>
                                </div>
                            ) : user?.roleND === "ADMIN" && election.trangThai === "Chưa diễn ra" ? (
                                <div className="flex gap-1 justify-center items-center">
                                    <button className="bg-blue-600 text-white text-sm font-medium px-2 py-1 rounded-md cursor-pointer 
                                        hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md"
                                        onClick={() => handleUpdateBDvaKT(election._id, "Đang diễn ra")}>
                                        Bắt đầu
                                    </button>
                                </div>
                            ) : user?.roleND === "ADMIN" && election.trangThai === "Đang diễn ra" ? (
                                <div className="flex gap-1 justify-center items-center">
                                    <button className="bg-gray-600 text-white text-sm font-medium px-2 py-1 rounded-md cursor-pointer 
                                        hover:bg-gray-700 transition-all duration-300 ease-in-out shadow-md"
                                        onClick={() => handleUpdateBDvaKT(election._id, "Đã kết thúc")}>
                                        Kết thúc
                                    </button>
                                </div>
                            ) : user?._id?.toString() === election?.idNguoiTao?._id?.toString() && 
                            (election.trangThai === "Chờ xét duyệt" || election.trangThai === "Từ chối") ? (
                                <>
                                    <span 
                                        className={`font-medium ${
                                            {
                                                "Chờ xét duyệt": "text-yellow-500",
                                                "Từ chối": "text-red-500",
                                                "Chưa diễn ra": "text-blue-500",
                                                "Đang diễn ra": "text-green-600",
                                                "Đã kết thúc": "text-gray-500"
                                            }[election.trangThai] || "text-black"
                                        }`}
                                    >
                                        {election.trangThai}
                                    </span>

                                    <button 
                                        className="ml-3 text-red-500 text-sm font-medium rounded-md cursor-pointer mt-2 
                                            transition-all duration-300 ease-in-out 
                                            hover:text-red-700 hover:scale-105 
                                            active:scale-95"
                                        onClick={() => handleDelete(election._id)}
                                    >
                                        Xóa
                                    </button>
                                </>
                            ) : (
                                <span 
                                    className={`font-medium ${
                                        {
                                            "Chờ xét duyệt": "text-yellow-500",
                                            "Từ chối": "text-red-500",
                                            "Chưa diễn ra": "text-blue-500",
                                            "Đang diễn ra": "text-green-600",
                                            "Đã kết thúc": "text-gray-500"
                                        }[election.trangThai] || "text-black"
                                    }`}
                                >
                                    {election.trangThai}
                                </span>

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

            {moThem && (
                <div className='fixed top-0 left-0 bg-black/50 w-full h-full flex items-center justify-center'>
                    <div className='bg-white w-150 h-fit relative p-7'>
                        <button className="absolute top-0 right-0 text-lg py-2 px-3 text-center cursor-pointer hover:bg-red-500 hover:text-white"
                            onClick={
                                () => {setMoThem(false);
                                    setDotBauCu({
                                        tenDotBauCu: "",
                                        ngayBatDau: "",
                                        ngayKetThuc: ""
                                    });
                                }}
                            >
                            <MdClose />
                        </button>
                        <h1 className="text-2xl font-bold text-blue-900 text-center mb-4">TẠO ĐỢT BẦU CỬ MỚI</h1>

                        <form onSubmit={handleSubmit} className="space-y-2">
                            <div>
                                <label className="block font-medium mb-2">Tên đợt bầu cử:</label>
                                <input 
                                    type="text" 
                                    name="tenDotBauCu"
                                    value={dotBauCu.tenDotBauCu}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            </div>
                            <div className='flex justify-between gap-3 mt-4'>
                                <div className='w-full'>
                                    <label className="block font-medium mb-2">Ngày bắt đầu:</label>
                                    <input 
                                        type="datetime-local" 
                                        name="ngayBatDau"
                                        value={dotBauCu.ngayBatDau}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className='w-full'>
                                    <label className="block font-medium mb-2">Ngày kết thúc:</label>
                                    <input 
                                        type="datetime-local" 
                                        name="ngayKetThuc"
                                        value={dotBauCu.ngayKetThuc}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>

                            <button type="submit" className="mt-5 w-full bg-blue-800 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-900 transition">
                                Thêm đợt bầu cử
                            </button>
                        </form>                    
                    </div>
                </div>
            )}
        </MainLayout>
    )
}

export default ElectionPage

import React from 'react'
import MainLayout from '../layouts/MainLayout'
// import { useNavigate } from "react-router-dom";
// import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useState, useEffect } from 'react';
import { MdClose } from "react-icons/md";
import axios from "axios";
import { useAuth } from '../context/AuthContext2';

function UserPage() {
    const { user } = useAuth();
    
    // const navigate = useNavigate();
    // const page = 1;
    // const tongPages = 1;

    const [moThem, setMoThem] = useState(false)
    const [userNew, setUserNew] = useState({
        username: "",
        email: "",
        matKhau: "",
        moTaND: "",
        roleND: "",
    }); 

    const [userList, setUserList] = useState([])

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("/api/auth/lay");
                //console.log(response.data)
                setUserList(response.data);
            } catch (err) {
                setError("Lỗi khi tải dữ liệu!");
                console.error("Lỗi API:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // if (loading) return <MainLayout><p>Đang tải...</p></MainLayout>;
    // if (error) return <MainLayout>{error}</MainLayout>;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserNew((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post("/api/auth/signup", userNew);
    
            if (response.status === 201) {
                setMoThem(false);
                setUserNew({
                    username: "",
                    email: "",
                    matKhau: "",
                    moTaND: "",
                    roleND: "",
                });
                alert("Thêm người dùng thành công!");
                window.location.reload();
            } else {
                alert("Có lỗi xảy ra!");
            }
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
            alert("Lỗi khi gửi dữ liệu lên server!");
        }
    };

    const handleUpdate = async (id, trangThaiMoi) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn cập nhật người dùng này?");
        if (!isConfirmed) return;
        try {
            const response = await axios.put(`/api/auth/capnhat/${id}`, { trangThaiMoi });
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert(error.response?.data?.message || "Lỗi khi cập nhật người dùng!");
        }
    };

    return (
        <MainLayout>
            <div className='w-full h-full p-3'>
                <div className='flex justify-between items-center mb-3 cursor-pointer'>
                    <h1 className='text-blue-950 text-4xl font-extrabold'>DANH SÁCH ĐỢT BẦU CỬ</h1>
                    {user?.roleND  === "ADMIN" && (
                        <div className='rounded-full shadow-lg px-7 py-3 bg-blue-950 text-white w-fit font-medium hover:bg-blue-800 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out'
                            onClick={() => setMoThem(true)}>
                            Thêm
                        </div>
                    )}
                </div>
                <div className='border-2 border-blue-950'>
                    <div className='w-full bg-blue-950 text-white grid grid-cols-18 items-center font-semibold'>
                        <div className='col-span-1 text-center border-r py-4 uppercase'>#</div>
                        <div className='col-span-3 text-center border-r py-4 uppercase'>Id</div>
                        <div className='col-span-3 border-r py-4 text-center uppercase'>Username</div>
                        <div className='col-span-4 border-r py-4 text-center uppercase'>Email</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Vai trò</div>
                        <div className='col-span-1 border-r py-4 text-center uppercase'>Mở</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Trạng thái</div>
                        <div className='col-span-2 py-4 text-center uppercase'>Hành động</div>
                    </div>
                    {userList.map((u, index) => (
                        <div key={u._id} className='w-full shadow-md grid grid-cols-18 items-center border-b odd:bg-gray-100 even:bg-white'>
                            <div className='col-span-1 text-center border-r py-4'>{index+1}</div>
                            <div className='col-span-3 text-center border-r py-4'>{u._id}</div>
                            <div className='col-span-3 border-r py-4 text-center'>{u.username}</div>
                            <div className='col-span-4 border-r py-4 text-center'>{u.email}</div>
                            <div className='col-span-2 border-r py-4 text-center'>{u.roleND}</div>
                            <div className='col-span-1 border-r py-4 text-center'>
                                {u.lanDau ? "Chưa" : "Rồi"}
                            </div>
                            <div className='col-span-2 border-r py-4 text-center'>{u.trangThai}</div>
                            <div className='col-span-2 py-4 text-center'>
                            {user?.roleND === "ADMIN" && u.trangThai === "Hoạt động" ? (
                                <button 
                                    className="bg-red-600 text-white text-sm font-medium px-2 py-1 rounded-md cursor-pointer 
                                    hover:bg-red-700 transition-all duration-300 ease-in-out shadow-md"
                                    onClick={() => handleUpdate(u._id, "Khóa")}
                                >
                                    Khóa Tài Khoản
                                </button>
                            ) : user?.roleND === "ADMIN" && u.trangThai === "Khóa" ? (
                                <button 
                                    className="bg-green-600 text-white text-sm font-medium px-2 py-1 rounded-md cursor-pointer 
                                    hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md"
                                    onClick={() => handleUpdate(u._id, "Hoạt động")}
                                >
                                    Mở Tài Khoản
                                </button>
                            ) : (
                                <span className="text-gray-500 text-sm">Không có quyền</span>
                            )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {moThem && (
                <div className='fixed top-0 left-0 bg-black/50 w-full h-full flex items-center justify-center'>
                    <div className='bg-white w-150 h-fit relative p-7'>
                        <button className="absolute top-0 right-0 text-lg py-2 px-3 text-center cursor-pointer hover:bg-red-500 hover:text-white"
                            onClick={
                                () => { setMoThem(false);
                                        setUserNew({
                                            username: "",
                                            email: "",
                                            matKhau: "",
                                            moTaND: "",
                                            roleND: "",
                                        });
                                }}
                            >
                            <MdClose />
                        </button>
                        <h1 className="text-2xl font-bold text-blue-900 text-center mb-4">TẠO NGƯỜI DÙNG MỚI</h1>

                        <form onSubmit={handleSubmit} className="space-y-2">
                            <div>
                                <label className="block font-medium mb-2">Username:</label>
                                <input 
                                    type="text" 
                                    name="username"
                                    value={userNew.username}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            </div>
                            <div>
                                <label className="block font-medium mb-2">Email:</label>
                                <input 
                                    type="email"
                                    name="email"
                                    value={userNew.email}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            </div>
                            <div>
                                <label className="block font-medium mb-2">Mật khẩu</label>
                                <input 
                                    type="text" 
                                    name="matKhau"
                                    value={userNew.matKhau}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            </div>
                            <div>
                                <label className="block font-medium mb-2">Mô tả:</label>
                                <input 
                                    type="text" 
                                    name="moTaND"
                                    value={userNew.moTaND}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            </div>
                            <div>
                                <label className="block font-medium mb-2">Vai trò:</label>
                                <input 
                                    type="text" 
                                    name="roleND"
                                    value={userNew.roleND}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            </div>
                            <button type="submit" className="mt-5 w-full bg-blue-800 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-900 transition">
                                Thêm người dùng
                            </button>
                        </form>                    
                    </div>
                </div>
            )}
        </MainLayout>
    )
}

export default UserPage
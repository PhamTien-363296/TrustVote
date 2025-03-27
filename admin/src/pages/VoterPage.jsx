import React, { useState, useEffect } from "react";
import MainLayout from '../layouts/MainLayout'
//import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdClose } from "react-icons/md";
import { useAuth } from "../context/AuthContext2";

function VoterPage() {
    const { user } = useAuth();
    //const navigate = useNavigate();
    const [cuTriList, setCuTriList] = useState([]);

    const [moThem, setMoThem] = useState(false);

    const [cuTri, setCuTri] = useState({
        hoVaTen: "",
        cccd: "",
        maDotBauCu:"",
        diaChiChiTiet: "",
        diaChi: {
            capTinh: { id: "", name: "" },
            capHuyen: { id: "", name: "" },
            capXa: { id: "", name: "" },
        },
    });
    
    const [capTinhList, setCapTinhList] = useState([]);
    const [capHuyenList, setCapHuyenList] = useState([]);
    const [capXaList, setCapXaList] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCuTri = async () => {
            try {
                const response = await axios.get("/api/cutri/lay");
                //console.log(response.data)
                setCuTriList(response.data);
            } catch (err) {
                setError("Lỗi khi tải dữ liệu!");
                console.error("Lỗi API:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCuTri();
    }, []);

    useEffect(() => {
        const layDanhSachTinhThanh = async () => {
            try {
                const response = await axios.get("https://provinces.open-api.vn/api/?depth=1");
                setCapTinhList(response.data || []);
                //console.log(response.data)
            } catch (error) {
                console.error("Lỗi khi tải danh sách tỉnh/thành:", error);
                setCapTinhList([]);
            }
        };
        layDanhSachTinhThanh();
    }, []);

    const xuLyThayDoiCapTinh = async (e) => {
        const tinhId = e.target.value;
        const tinh = capTinhList.find(t => t.code === parseInt(tinhId));
    
        setCuTri((prev) => ({
            ...prev,
            diaChi: {
                capTinh: { id: tinhId, name: tinh?.name || "" },
                capHuyen: { id: "", name: "" },
                capXa: { id: "", name: "" },
            }
        }));
    
        if (tinhId) {
            try {
                const response = await axios.get(`https://provinces.open-api.vn/api/p/${tinhId}?depth=2`);
                setCapHuyenList(response.data?.districts || []);
            } catch (error) {
                console.error("Lỗi khi tải danh sách huyện: ", error);
            }            
        }
    };   

    const xuLyChonHuyen = async (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const huyenId = selectedOption.value;
    
        setCuTri((prev) => ({
            ...prev,
            diaChi: {
                ...prev.diaChi, 
                capHuyen: { id: huyenId, name: selectedOption.textContent },
                capXa: { id: "", name: "" }, // Reset xã khi đổi huyện
            }
        }));
    
        if (huyenId) {
            try {
                const response = await axios.get(`https://provinces.open-api.vn/api/d/${huyenId}?depth=2`);
                setCapXaList(response.data?.wards || []);
            } catch (error) {
                console.error("Lỗi khi tải danh sách xã: ", error);
            }
        }
    };
    
    const xuLyChonXa = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];

        setCuTri((prev) => ({
            ...prev,
            diaChi: {
                ...prev.diaChi, // Giữ nguyên `capTinh` và `capHuyen`
                capXa: { id: selectedOption.value, name: selectedOption.textContent }, // Thêm `capXa`
            }
        }));
    };    

    const handleChange = (e) => {
        setCuTri((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!cuTri.hoVaTen || !cuTri.cccd || !cuTri.diaChi || !cuTri.diaChiChiTiet) {
            console.error("Vui lòng điền đầy đủ thông tin");
            return;
        }
    
        try {
            const response = await axios.post("/api/cutri/them", cuTri);
    
            if (response.status === 200 || response.status === 201) {
                alert("Thêm cử tri thành công!");
                window.location.reload();
                setMoThem(false);
                setCapHuyenList([]);
                setCuTri({
                    hoVaTen: "",
                    cccd: "",
                    maDotBauCu:"",
                    diaChiChiTiet: "",
                    diaChi: {
                        capTinh: { id: "", name: "" },
                        capHuyen: { id: "", name: "" },
                        capXa: { id: "", name: "" },
                    },
                });
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
            alert("Lỗi kết nối đến server!");
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa cử tri này?");
        if (!isConfirmed) return;
    
        try {
            const response = await axios.delete(`/api/cutri/xoa/${id}`);
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            alert(error.response?.data?.message || "Lỗi khi xóa cử tri!");
        }
    };

    const handleUpdate = async (id, trangThaiMoi) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn cập nhật cử tri này?");
        if (!isConfirmed) return;
        try {
            const response = await axios.put(`/api/cutri/capnhat/${id}`, { trangThaiMoi });
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert(error.response?.data?.message || "Lỗi khi cập nhật cử tri!");
        }
    };
    

    // if (loading) return <p>Đang tải...</p>;
    // if (error) return <p>{error}</p>;

    return (
        <MainLayout>
            <div className='w-full h-full p-3'>
                <div className='flex justify-between items-center mb-3 cursor-pointer'>
                    <h1 className='text-blue-950 text-4xl font-extrabold'>DANH SÁCH CỬ TRI</h1>
                    <div className='flex gap-3'>
                        {/* <div className='rounded-full shadow-lg px-7 py-2 text-blue-950 border-2 bg-slate-100 border-blue-950 w-fit font-medium 
                        hover:bg-blue-800 hover:text-white hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out'>
                            Lọc
                        </div> */}
                        {user?.roleND  === "VOTER_MANAGER" && (
                        <div className='rounded-full shadow-lg px-7 py-3 bg-blue-950 text-white w-fit font-medium hover:bg-blue-800 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out'
                            onClick={() => setMoThem(true)}>
                            Thêm
                        </div>
                        )}
                    </div>
                </div>
                <div className='border-2 border-blue-950'>
                    <div className='w-full bg-blue-950 text-white grid grid-cols-23 items-center font-semibold'>
                        <div className='col-span-1 text-center border-r py-4 uppercase'>#</div>
                        <div className='col-span-4 border-r py-4 text-center uppercase'>Họ và Tên</div>
                        <div className='col-span-3 border-r py-4 text-center uppercase'>CCCD</div>
                        <div className='col-span-3 border-r py-4 text-center uppercase'>Địa chỉ</div>
                        <div className='col-span-3 border-r py-4 text-center uppercase'>Khu vực</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Trạng thái</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Người thêm</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Người duyệt</div>
                        <div className='col-span-3 py-4 text-center uppercase'>Hành động</div>
                    </div>
                </div>
                {cuTriList.map((v, index) => (
                    <div key={index} className='w-full shadow-md grid grid-cols-23 items-center border-b odd:bg-gray-100 even:bg-white'>
                        <div className='col-span-1 text-center border-r py-4'>{index + 1}</div>
                        <div className='col-span-4 border-r py-4 text-center'>{v.hoVaTen}</div>
                        <div className='col-span-3 border-r py-4 text-center'>{v.cccd}</div>
                        <div className='col-span-3 border-r py-4 text-center'>{v.diaChi.diaChiChiTiet}</div>
                        <div className='col-span-3 border-r py-4 pl-2 flex flex-col'>
                            <p>{v.diaChi?.capTinh?.ten || "Không có dữ liệu"}</p>
                            <p>{v.diaChi?.capHuyen?.ten || "Không có dữ liệu"}</p>
                            <p>{v.diaChi?.capXa?.ten || "Không có dữ liệu"}</p>
                        </div>
                        <div className='col-span-2 border-r py-4 text-center'>{v.trangThai}</div>
                        <div className='col-span-2 border-r py-4 text-center'>{v.idNguoiTao.username}</div>
                        <div className='col-span-2 border-r py-4 text-center'>
                            {v?.idNguoiDuyet?.username ? (
                                v.idNguoiDuyet.username
                            ) : (
                                <span className="text-gray-400">Chưa ai duyệt</span>
                            )}
                        </div>
                        <div className='col-span-3 py-4 text-center'>
                        {user?.roleND === "ELECTION_VERIFIER" && v.trangThai === "Chờ xét duyệt" ? (
                            <div className="flex gap-1 justify-center items-center">
                                <button className="bg-green-600 text-white text-sm font-medium px-2 py-1 rounded-md cursor-pointer 
                                    hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md"
                                    onClick={() => handleUpdate(v._id, "Chưa kích hoạt")}>
                                    Duyệt
                                </button>
                                <button className="bg-red-600 text-white text-sm font-medium px-2 py-1 rounded-md cursor-pointer 
                                    hover:bg-red-700 transition-all duration-300 ease-in-out shadow-md"
                                    onClick={() => handleUpdate(v._id, "Từ chối")}>
                                    Từ chối
                                </button>
                            </div>
                        ) : user?._id?.toString() === v?.idNguoiTao?._id?.toString() && 
                        (v.trangThai === "Chờ xét duyệt" || v.trangThai === "Từ chối") ? (
                            <>
                                <span 
                                    className={`font-medium ${
                                        {
                                            "Chờ xét duyệt": "text-yellow-500",
                                            "Từ chối": "text-red-500",
                                            "Chưa kích hoạt": "text-blue-500",
                                            "Hoạt động": "text-green-600",
                                            "Tạm dừng": "text-gray-500",
                                            "Khóa": "text-gray-500"
                                        }[v.trangThai] || "text-black"
                                    }`}
                                >
                                    {v.trangThai}
                                </span>
                                <button 
                                    className="ml-3 text-red-500 text-sm font-medium rounded-md cursor-pointer mt-2 
                                        transition-all duration-300 ease-in-out 
                                        hover:text-red-700 hover:scale-105 
                                        active:scale-95"
                                    onClick={() => handleDelete(v._id)}
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
                                    }[v.trangThai] || "text-black"
                                }`}
                            >
                                {v.trangThai}
                            </span>
                        )}
                        </div>
                    </div>
                ))}
            </div>
            {moThem && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
                    <div className="bg-white w-96 md:w-[500px] p-7 rounded-lg shadow-lg relative">
                        <button
                            className="absolute top-3 right-3 text-lg p-2 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white transition"
                            onClick={() => {
                                setMoThem(false);
                                setCapHuyenList([]);
                                setCuTri({
                                    hoVaTen: "",
                                    cccd: "",
                                    maDotBauCu:"",
                                    diaChiChiTiet: "",
                                    diaChi: {
                                        capTinh: { id: "", name: "" },
                                        capHuyen: { id: "", name: "" },
                                        capXa: { id: "", name: "" },
                                    },
                                });
                            }}
                        >
                            <MdClose />
                        </button>
                        <h1 className="text-2xl font-bold text-blue-900 text-center mb-5">TẠO CỬ TRI MỚI</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-medium mb-2">Họ và tên:</label>
                                <input
                                    type="text"
                                    name="hoVaTen"
                                    value={cuTri.hoVaTen}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-2">CCCD:</label>
                                <input
                                    type="text"
                                    name="cccd"
                                    value={cuTri.cccd}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-2">Tỉnh / Thành phố trực thuộc trung ương:</label>
                                <select className="w-full border p-2 rounded-lg" onChange={xuLyThayDoiCapTinh}>
                                    <option value=""></option>
                                    {capTinhList.map(tinh => (
                                        <option key={tinh.code} value={tinh.code}>{tinh.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium mb-2">Quận / Huyện / Thị xã / Thành phố thuộc tỉnh / Thành phố thuộc thành phố trực thuộc trung ương:</label>
                                <select className="w-full border p-2 rounded-lg" onChange={xuLyChonHuyen}>
                                    <option value=""></option>
                                    {capHuyenList.map(huyen => (
                                        <option key={huyen.code} value={huyen.code}>{huyen.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium mb-2"> Xã / Phường / Thị trấn:</label>
                                <select className="w-full border p-2 rounded-lg" onChange={xuLyChonXa} disabled={capXaList.length === 0}>
                                    <option value=""></option>
                                    {capXaList.map(xa => (
                                        <option key={xa.code} value={xa.code}>{xa.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium mb-2">Địa chỉ cụ thể:</label>
                                <input
                                    type="text"
                                    name="diaChiChiTiet"
                                    value={cuTri.diaChiChiTiet}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <p><strong>Tỉnh/Thành Phố </strong>, <strong>Quận/Huyện</strong>, <strong>Xã/Phường</strong> </p>
                                <p> {cuTri?.diaChi?.capTinh?.name || "Chưa chọn"}, {cuTri?.diaChi?.capHuyen?.name || "Chưa chọn"}, {cuTri?.diaChi?.capXa?.name || "Chưa chọn"}</p>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-800 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-900 transition"
                            >
                                Thêm đơn vị bầu cử
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    )
}

export default VoterPage
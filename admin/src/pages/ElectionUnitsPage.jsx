import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext2";

function ElectionUnitsPage() {
    const { user } = useAuth();
    
    // const navigate = useNavigate();
    const [donViBauCuList, setDonViBauCuList] = useState([]);
    
    const [moThem, setMoThem] = useState(false);
    // const [moChon, setMoChon] = useState(false);
    const [dotBauCuDaChon, setDotBauCuDaChon] = useState(null);

    const [donViBauCu, setDonViBauCu] = useState({
        idDotBauCu: "",
        tenDonVi: "",
        soDaiBieuDuocBau: "",
        tinhThanh: null,
        capHuyen: [],
    });
    const [dotBauCuList, setDotBauCuList] = useState([]);
    const [capTinhList, setCapTinhList] = useState([]);
    const [capHuyenList, setCapHuyenList] = useState([]);

    const [selectedHuyen, setSelectedHuyen] = useState([]);
    const [tinhThanhDaChon, setTinhThanhDaChon] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const layDuLieu = async () => {
            try {
                setLoading(true);
                const [dotBauCuRes, tinhThanhRes] = await Promise.all([
                    axios.get("/api/dotbaucu/lay/daduyet"),
                    axios.get("https://provinces.open-api.vn/api/?depth=1")
                ]);
                setDotBauCuList(dotBauCuRes.data);
                setCapTinhList(tinhThanhRes.data || []);

                const dotBauCuMacDinh = dotBauCuRes.data.length > 0 ? dotBauCuRes.data[0] : null;
                setDotBauCuDaChon(dotBauCuMacDinh);

                if (dotBauCuMacDinh) {
                    const donViRes = await axios.get(`/api/donvi/lay/${dotBauCuMacDinh._id}`);
                    setDonViBauCuList(donViRes.data);
                }
            } catch (err) {
                setError("Lỗi khi tải dữ liệu!");
                console.error("Lỗi API:", err);
            } finally {
                setLoading(false);
            }
        };
        layDuLieu();
    }, []);

    useEffect(() => {
        const layDonViBauCu = async () => {
            if (!dotBauCuDaChon) return;
    
            try {
                const donViRes = await axios.get(`/api/donvi/lay/${dotBauCuDaChon._id}`);
                setDonViBauCuList(donViRes.data);
            } catch (err) {
                console.error("Lỗi khi tải danh sách đơn vị bầu cử:", err);
            }
        };
    
        layDonViBauCu();
    }, [dotBauCuDaChon]);
    

    const danhSachLoc = donViBauCuList.filter((donVi) =>
        tinhThanhDaChon ? donVi.capTinh.id === tinhThanhDaChon : true
    );

    const xuLyThayDoiCapTinh = async (e) => {
        const tinhId = e.target.value;
        const tinh = capTinhList.find(t => t.code === parseInt(tinhId));
    
        setDonViBauCu((prev) => ({
            ...prev,
            capTinh: { id: tinhId, name: tinh?.name || "" },
            capHuyen: [],
            capXa: [],
        }));
    
        if (tinhId) {
            try {
                const response = await axios.get(`https://provinces.open-api.vn/api/p/${tinhId}?depth=2`);
                setCapHuyenList(response.data?.districts || []);
                setSelectedHuyen([]);
            } catch {
                console.error("Lỗi khi tải danh sách huyện: ", error);
            }
        } else {
            setCapHuyenList([]);
        }
    };     
    
    const xuLyChonHuyen = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        setSelectedHuyen(selectedOptions.map(option => ({ id: option.value, name: option.textContent })));
    };
    
    const themHuyen = async () => {
        setDonViBauCu(prev => ({
            ...prev,
            capHuyen: [...prev.capHuyen, ...selectedHuyen],
        }));
    };

    const handleChange = (e) => {
        setDonViBauCu((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Dữ liệu gửi đi", donViBauCu)

        try {
            const response = await axios.post("/api/donvi/them", donViBauCu);
    
            if (response.status === 201) {
                alert("Thêm đơn vị bầu cử thành công!");
                setMoThem(false);
                setCapHuyenList([]);
                setDonViBauCu((prev) => ({
                    ...prev,
                    tenDonVi: "",
                    soDaiBieuDuocBau: "",
                    tinhThanh: null,
                    capHuyen: [],
                }));
                window.location.reload();
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
            const response = await axios.delete(`/api/donvi/xoa/${id}`);
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            alert(error.response?.data?.message || "Lỗi khi xóa cử tri!");
        }
    };

    const handleUpdate = async (id, trangThaiMoi) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn cập nhật đơn vị này?");
        if (!isConfirmed) return;
    
        const privateKey = prompt("Nhập private key để ký giao dịch:");
        if (!privateKey) {
            alert("Bạn cần nhập private key!");
            return;
        }
    
        try {
            const response = await axios.put(`/api/donvi/capnhat/${id}`, { 
                trangThaiMoi, 
                privateKey 
            });
    
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert(error.response?.data?.message || "Lỗi khi cập nhật đơn vị!");
        }
    };
    
    
    if (loading) return <MainLayout><p>Đang tải...</p></MainLayout>;

    if (error) return <p>{error}</p>;
    
    return (
        <MainLayout>
            <div className="w-full h-full p-3">
                <div className="flex justify-between items-center mb-3 cursor-pointer">
                    <h1 className="text-blue-950 text-4xl font-extrabold">DANH SÁCH ĐƠN VỊ BẦU CỬ</h1>
                    <div className="flex gap-3">
                        <div className="relative">
                            <select
                                className="rounded-md shadow-lg px-4 py-2 border border-gray-300 text-gray-700 cursor-pointer"
                                onChange={(e) => setTinhThanhDaChon(e.target.value)}
                                value={tinhThanhDaChon || ""}
                            >
                                <option value="">Tất cả tỉnh thành</option>
                                {capTinhList.map((tinh, index) => (
                                    <option key={index} value={tinh.code}>
                                        {tinh.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <select
                            className="rounded-full shadow-lg px-4 py-2 border border-blue-950 text-blue-950 font-medium cursor-pointer hover:bg-blue-950 hover:text-white"
                            value={dotBauCuDaChon?._id || ""}
                            onChange={(e) => {
                                const dotBauCuMoi = dotBauCuList.find((d) => d._id === e.target.value);
                                if (dotBauCuMoi) {
                                    setDotBauCuDaChon(dotBauCuMoi);
                                    setDonViBauCu((prev) => ({
                                        ...prev,
                                        idDotBauCu: dotBauCuMoi._id,
                                    }));
                                }
                            }}
                        >
                            <option value="" disabled>Chọn đợt bầu cử</option>
                            {dotBauCuList.map((d) => (
                                <option key={d._id} value={d._id}>
                                    {d.tenDotBauCu}
                                </option>
                            ))}
                        </select>

                        {user?.roleND  === "DISTRICT_MANAGER" && (
                        <div className='rounded-full shadow-lg px-7 py-3 bg-blue-950 text-white w-fit font-medium hover:bg-blue-800 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out'
                            onClick={() => setMoThem(true)}>
                            Thêm
                        </div>
                        )}
                    </div>
                </div>
                <div className="border-2 border-blue-950">
                    <div className="w-full bg-blue-950 text-white grid grid-cols-21 items-center font-semibold">
                        <div className="col-span-1 text-center border-r py-4 uppercase">#</div>
                        <div className="col-span-3 text-center border-r py-4 uppercase">Mã đơn vị</div>
                        <div className="col-span-2 border-r py-4 text-center uppercase">Tên đơn vị</div>
                        <div className="col-span-2 border-r py-4 text-center uppercase">Tỉnh thành</div>
                        <div className="col-span-6 border-r py-4 text-center uppercase">Quận huyện</div>
                        <div className="col-span-1 border-r py-4 text-center uppercase">Số đại biểu</div>
                        <div className="col-span-2 border-r py-4 text-center uppercase">Người tạo</div>
                        <div className="col-span-2 border-r py-4 text-center uppercase">Người duyệt</div>
                        <div className="col-span-2 py-4 text-center uppercase">Trạng thái</div>
                    </div>
                    {danhSachLoc.length === 0 ? (
                        <div className="w-full py-4 text-center text-gray-500 font-medium">
                            Chưa có đơn vị bầu cử nào.
                        </div>
                    ) : (
                        danhSachLoc.map((election, index) => (
                            <div key={index} className='w-full shadow-md grid grid-cols-21 items-center border-b odd:bg-gray-100 even:bg-white'>
                                <div className='col-span-1 text-center border-r py-4'>{index + 1}</div>
                                <div className='col-span-3 text-center border-r py-4 uppercase'>{election.maDonViBauCu}</div>
                                <div className='col-span-2 border-r py-4 text-center'>{election.tenDonVi}</div>
                                <div className='col-span-2 border-r py-4 text-center'>{election?.capTinh?.ten}</div>
                                <div className='col-span-6 border-r py-4 text-center'>
                                    {election?.capHuyen?.map(huyen => huyen.ten).join(", ")}
                                </div>
                                <div className='col-span-1 border-r py-4 text-center'>{election.soDaiBieuDuocBau}</div>
                                <div className='col-span-2 border-r py-4 text-center'>{election.idNguoiTao.username}</div>
                                <div className='col-span-2 border-r py-4 text-center'>
                                    {election?.idNguoiDuyet?.username ? (
                                        election.idNguoiDuyet.username
                                    ) : (
                                        <span className="text-gray-400">Chưa ai duyệt</span>
                                    )}
                                </div>

                                <div className="col-span-2 py-4 text-center">
                                {user?.roleND === "ELECTION_VERIFIER" && election.trangThai === "Chờ xét duyệt" ? (
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
                        ))
                    )}
                </div>
            </div>

            {moThem && (
            <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
                <div className="bg-white w-96 md:w-[500px] p-7 rounded-lg shadow-lg relative">
                    <button
                        className="absolute top-3 right-3 text-lg p-2 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white transition"
                        onClick={() => {
                            setMoThem(false);
                            setCapHuyenList([]);
                            setDonViBauCu((prev) => ({
                                idDotBauCu: prev.idDotBauCu,
                                tenDonVi: "",
                                soDaiBieuDuocBau: "",
                                tinhThanh: null,
                                capHuyen: [],
                            }));
                        }}
                    >
                        <MdClose />
                    </button>
                    <h1 className="text-2xl font-bold text-blue-900 text-center mb-5">TẠO ĐƠN VỊ BẦU CỬ MỚI</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-medium mb-2">Tên đơn vị bầu cử:</label>
                            <input
                                type="text"
                                name="tenDonVi"
                                value={donViBauCu.tenDonVi}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-2">Tỉnh/Thành phố:</label>
                            <select className="w-full border p-2 rounded-lg" onChange={xuLyThayDoiCapTinh}>
                                <option value="">Chọn tỉnh/thành</option>
                                {capTinhList.map(tinh => (
                                    <option key={tinh.code} value={tinh.code}>{tinh.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-2">Quận/Huyện:</label>
                            <select className="w-full border p-2 rounded-lg" multiple onChange={xuLyChonHuyen}>
                                {capHuyenList.map(huyen => (
                                    <option key={huyen.code} value={huyen.code}>{huyen.name}</option>
                                ))}
                            </select>
                            <div className="text-center w-fit mt-2 ml-auto px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={themHuyen}>Thêm huyện/quận</div>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <p><strong>Tỉnh/Thành Phố:</strong> {donViBauCu?.capTinh?.name || "Chưa chọn"}</p>
                            <p><strong>Quận/Huyện:</strong> {donViBauCu?.capHuyen?.map(h => h.name).join(", ") || "Chưa chọn"}</p>
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">Số đại biểu được bầu:</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-md"
                                value={donViBauCu.soDaiBieuDuocBau}
                                onChange={(e) =>
                                    setDonViBauCu((prev) => ({
                                        ...prev,
                                        soDaiBieuDuocBau: e.target.value,
                                    }))
                                }
                            />
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
    );
}

export default ElectionUnitsPage;

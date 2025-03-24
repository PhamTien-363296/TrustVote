import React, { useState, useEffect } from "react";
import MainLayout from '../layouts/MainLayout'
import axios from "axios";
import { MdClose } from "react-icons/md";
import { useAuth } from "../context/AuthContext2";
import CandidateDetail from "../components/CandidateDetail";
import CandidateForm from "../components/CandidateForm";

function CandidatesPage() {
    const { user } = useAuth();
    const [ungCuVienList, setUngCuVienList] = useState([]);
    const [ungCuVien, setUngCuVien] = useState(null);
    const [donViBauCuList, setDonViBauCuList] = useState([]);
    const [dotBauCuDaChon, setDotBauCuDaChon] = useState(null);
    const [dotBauCuList, setDotBauCuList] = useState([]);

    const [moThem, setMoThem] = useState(false)
    const [moChiTiet, setMoChiTiet] = useState(false)

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [ungCuVienMoi, setUngCuVienMoi] = useState({
        hinhAnh: "",
        idDonViBauCu: "",
        idDotBauCu: "",
        hoVaTen: "",
        ngaySinh: "",
        gioiTinh: "",
        quocTich: "",
        danToc: "",
        tonGiao: "",
        queQuan: {
            capTinh: { id: "", name: "" },
            capHuyen: { id: "", name: "" },
            capXa: { id: "", name: "" },
        },
        noiO: "",
        trinhDoHocVan: {
            phoThong: "",
            chuyenMon: "",
            hocVi: "",
            lyLuan: "",
            ngoaiNgu: "",
        },
        ngheNghiep: "",
        noiCongTac: "",
        ngayVaoDang: "",
        laDaiBieuQH: "",
        laDaiBieuHDND: "",
    }); 

    const [capTinhList, setCapTinhList] = useState([]);
    const [capHuyenList, setCapHuyenList] = useState([]);
    const [capXaList, setCapXaList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [donViRes, dotBauCuRes, tinhThanhRes] = await Promise.all([
                    axios.get("/api/donvi/lay/dv/chuadienra"),
                    axios.get("/api/dotbaucu/lay/daduyet"),
                    axios.get("https://provinces.open-api.vn/api/?depth=1")
                ]);
    
                setDonViBauCuList(donViRes.data);
                setCapTinhList(tinhThanhRes.data || []);
                setDotBauCuList(dotBauCuRes.data);
    
                // Chọn đợt bầu cử mặc định nếu có
                const dotBauCuMacDinh = dotBauCuRes.data.length > 0 ? dotBauCuRes.data[0] : null;
                setDotBauCuDaChon(dotBauCuMacDinh);
                console.log("dotBauCuMacDinh", dotBauCuMacDinh);
                setUngCuVienMoi((prev) => ({
                    ...prev,
                    idDotBauCu: dotBauCuMacDinh._id,
                }));
    
                // Nếu có đợt bầu cử mặc định, tải danh sách ứng cử viên theo đợt đó
                if (dotBauCuMacDinh) {
                    await layUngCuVienTheoDot(dotBauCuMacDinh._id);
                }
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
                setError("Lỗi khi tải dữ liệu!");
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);
    
    useEffect(() => {
        console.log("dotBauCuDaChon", dotBauCuDaChon);
        console.log("ungCuVienMoi", ungCuVienMoi);
    }, [dotBauCuDaChon, ungCuVienMoi]);

    useEffect(() => {
        if (dotBauCuDaChon) {
            layUngCuVienTheoDot(dotBauCuDaChon._id);
        }
    }, [dotBauCuDaChon]);
    
    const layUngCuVienTheoDot = async (dotBauCuId) => {
        try {
            const ungCuVienRes = await axios.get(`/api/ungcuvien/laytheodot/${dotBauCuId}`);
            setUngCuVienList(ungCuVienRes.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách ứng cử viên:", err);
        }
    };    

    const xuLyThayDoiCapTinh = async (e) => {
        const tinhId = e.target.value;
        const tinh = capTinhList.find(t => t.code === parseInt(tinhId));
    
        setUngCuVienMoi((prev) => ({
            ...prev,
            queQuan: {
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
    
        setUngCuVienMoi((prev) => ({
            ...prev,
            queQuan: {
                ...prev.queQuan, 
                capHuyen: { id: huyenId, name: selectedOption.textContent },
                capXa: { id: "", name: "" },
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
    
        setUngCuVienMoi((prev) => ({
            ...prev,
            queQuan: {
                ...prev.queQuan,
                capXa: { id: selectedOption.value, name: selectedOption.textContent },
            }
        }));
    };    

    const handleChange = (e) => {
        setUngCuVienMoi((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleChange2 = (e) => {
        setUngCuVienMoi((prevState) => ({
            ...prevState,
            trinhDoHocVan: {
                ...prevState.trinhDoHocVan,
                [e.target.name]: e.target.value, 
            },
        }));
    };
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUngCuVienMoi((prev) => ({
                    ...prev,
                    hinhAnh: reader.result 
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post("/api/ungcuvien/them", ungCuVienMoi);
    
            if (response.status === 200 || response.status === 201) {
                alert("Thêm ứng cử viên thành công!");
                window.location.reload();
                setMoThem(false);
                setCapHuyenList([]);
                setUngCuVienMoi({
                    hinhAnh: "",
                    idDonViBauCu: "",
                    hoVaTen: "",
                    ngaySinh: "",
                    gioiTinh: "",
                    quocTich: "",
                    danToc: "",
                    tonGiao: "",
                    queQuan: {
                        capTinh: { id: "", name: "" },
                        capHuyen: { id: "", name: "" },
                        capXa: { id: "", name: "" },
                    },
                    noiO: "",
                    trinhDoHocVan: {
                        phoThong: "",
                        chuyenMon: "",
                        hocVi: "",
                        lyLuan: "",
                        ngoaiNgu: "",
                    },
                    ngheNghiep: "",
                    noiCongTac: "",
                    ngayVaoDang: "",
                    laDaiBieuQH: "",
                    laDaiBieuHDND: "",
                });
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
            alert("Lỗi kết nối đến server!");
        }
    };

    const xemChiTiet = async (id) => {
        try {
            const response = await axios.get(`/api/ungcuvien/lay/${id}`);
    
            if (response.status === 200) {
                setMoChiTiet(true);
                setUngCuVien(response.data);
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
            alert("Lỗi kết nối đến server!");
        }
    };    

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa ứng cử viên này?");
        if (!isConfirmed) return;
        try {
            const response = await axios.delete(`/api/ungcuvien/xoa/${id}`);
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            alert(error.response?.data?.message || "Lỗi khi xóa ứng cử viên!");
        }
    };

    const handleUpdateD = async (id) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn duyệt ứng cử viên này?");
        if (!isConfirmed) return;
    
        const privateKey = window.prompt("Vui lòng nhập private key để xác nhận:");
        if (!privateKey) {
            alert("Bạn cần nhập private key để tiếp tục!");
            return;
        }
    
        try {
            const response = await axios.post(`/api/ungcuvien/duyet`, { 
                candidateId: id, 
                privateKey 
            });
    
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert(error.response?.data?.message || "Lỗi khi cập nhật ứng cử viên!");
        }
    };
    

    const handleUpdateTC = async (id, trangThaiMoi) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn từ chối ứng cử viên này này?");
        if (!isConfirmed) return;
        try {
            const response = await axios.put(`/api/ungcuvien/capnhat/${id}`, { trangThaiMoi });
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert(error.response?.data?.message || "Lỗi khi cập nhật ứng cử viên!");
        }
    };

    if (loading) return <MainLayout><p>Đang tải...</p></MainLayout>;

    if (error) return <p>{error}</p>;

    return (
        <MainLayout>
            <div className='w-full h-full p-3'>
                <div className='flex justify-between items-center mb-3 cursor-pointer'>
                    <h1 className='text-blue-950 text-4xl font-extrabold'>DANH SÁCH ỨNG CỬ VIÊN</h1>
                    <div className='flex gap-3'>
                    <select
                        className="rounded-full shadow-lg px-4 py-2 border border-blue-950 text-blue-950 font-medium cursor-pointer hover:bg-blue-950 hover:text-white"
                        value={dotBauCuDaChon?._id || ""}
                        onChange={(e) => {
                            const dotBauCuMoi = dotBauCuList.find((d) => d._id === e.target.value);
                            if (dotBauCuMoi) {
                                setDotBauCuDaChon(dotBauCuMoi);
                                setUngCuVienMoi((prev) => ({
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
                    {user?.roleND  === "CANDIDATE_MANAGER" && (
                        <div className='rounded-full shadow-lg px-7 py-3 bg-blue-950 text-white w-fit font-medium hover:bg-blue-800 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out'
                            onClick={() => setMoThem(true)}>
                            Thêm
                        </div>
                    )}
                    </div>
                </div>
                <div className='border-2 border-blue-950'>
                    <div className='w-full bg-blue-950 text-white grid grid-cols-21 items-center font-semibold'>
                        <div className='col-span-1 text-center border-r py-4 uppercase'>#</div>
                        <div className='col-span-3 border-r py-4 text-center uppercase'>Họ và tên</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Ngày sinh</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Giới tính</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Quốc tịch</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Dân tộc</div>
                        <div className='col-span-3 border-r py-4 text-center uppercase'>Quê quán</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Người thêm</div>
                        <div className='col-span-2 border-r py-4 text-center uppercase'>Người duyệt</div>
                        <div className='col-span-2 py-4 text-center uppercase'>Trạng thái</div>
                    </div>
                </div>
                {ungCuVienList.map((c, index) => (
                    <div key={index} className='w-full shadow-md grid grid-cols-21 items-center border-b odd:bg-gray-100 even:bg-white cursor-pointer hover:bg-blue-50 hover:scale-100'
                        onClick={(e) => {
                            e.stopPropagation();
                            xemChiTiet(c._id);
                        }}>
                        <div className='col-span-1 text-center border-r py-4'>{index + 1}</div>
                        <div className='col-span-3 border-r py-4 text-center'>{c.hoVaTen}</div>
                        <div className='col-span-2 border-r py-4 text-center'>{c.ngaySinh}</div>
                        <div className='col-span-2 border-r py-4 text-center'>{c.gioiTinh}</div>
                        <div className='col-span-2 border-r py-4 text-center'>{c.quocTich}</div>
                        <div className='col-span-2 border-r py-4 text-center'>{c.danToc}</div>
                        <div className='col-span-3 border-r py-4 pl-2 flex flex-col'>
                            <p>{c.queQuan?.capTinh?.ten || "Không có dữ liệu"}</p>
                            <p>{c.queQuan?.capHuyen?.ten || "Không có dữ liệu"}</p>
                            <p>{c.queQuan?.capXa?.ten || "Không có dữ liệu"}</p>
                        </div>
                        <div className='col-span-2 border-r py-4 text-center'>{c.idNguoiTao.username}</div>
                        <div className='col-span-2 border-r py-4 text-center'>
                            {c?.idNguoiDuyet?.username ? (
                                c.idNguoiDuyet.username
                            ) : (
                                <span className="text-gray-400">Chưa ai duyệt</span>
                            )}
                        </div>
                        <div className='col-span-2 py-4 text-center'>
                        {user?.roleND === "ELECTION_VERIFIER" && c.trangThai === "Chờ xét duyệt" ? (
                            <div className="flex gap-1 justify-center items-center">
                                <button className="bg-green-600 text-white text-sm font-medium px-2 py-1 rounded-md cursor-pointer 
                                    hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateD(c._id);
                                    }}>
                                    Duyệt
                                </button>
                                <button className="bg-red-600 text-white text-sm font-medium px-2 py-1 rounded-md cursor-pointer 
                                    hover:bg-red-700 transition-all duration-300 ease-in-out shadow-md"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateTC(c._id, "Từ chối");
                                    }}>
                                    Từ chối
                                </button>
                            </div>
                        ) : user?._id?.toString() === c?.idNguoiTao?._id?.toString() && 
                        (c.trangThai === "Chờ xét duyệt" || c.trangThai === "Từ chối") ? (
                            <>
                                <span 
                                    className={`font-medium ${
                                        {
                                            "Chờ xét duyệt": "text-yellow-500",
                                            "Từ chối": "text-red-500",
                                            "Chưa diễn ra": "text-blue-500",
                                            "Đang diễn ra": "text-green-600",
                                            "Đã kết thúc": "text-gray-500"
                                        }[c.trangThai] || "text-black"
                                    }`}
                                >
                                    {c.trangThai}
                                </span>
                                <button 
                                    className="ml-3 text-red-500 text-sm font-medium rounded-md cursor-pointer mt-2 
                                        transition-all duration-300 ease-in-out 
                                        hover:text-red-700 hover:scale-105 
                                        active:scale-95"
                                    onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(c._id);
                                        }}
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
                                    }[c.trangThai] || "text-black"
                                }`}
                            >
                                {c.trangThai}
                            </span>

                        )}
                        </div>
                    </div>
                ))}
            </div>
            {moChiTiet && (
                <CandidateDetail moChiTiet={moChiTiet} setMoChiTiet={setMoChiTiet} ungCuVien={ungCuVien} />
            )}
            {moThem && (
                <CandidateForm
                    setMoThem={setMoThem}
                    setCapHuyenList={setCapHuyenList}
                    setUngCuVienMoi={setUngCuVienMoi}
                    ungCuVienMoi={ungCuVienMoi}
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    handleChange2={handleChange2}
                    xuLyThayDoiCapTinh={xuLyThayDoiCapTinh}
                    xuLyChonHuyen={xuLyChonHuyen}
                    xuLyChonXa={xuLyChonXa}
                    capTinhList={capTinhList}
                    capHuyenList={capHuyenList}
                    capXaList={capXaList}
                    donViBauCuList={donViBauCuList}
                    handleImageChange={handleImageChange}
                />
            )}
        </MainLayout>
    )
}

export default CandidatesPage
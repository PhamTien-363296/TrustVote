import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import moment from "moment";

function HomePage() {
  const navigate = useNavigate();
  const [matKhau, setMatKhau] = useState("");
  const [hienNhapKey, setHienNhapKey] = useState(false); // Ẩn/Hiện ô nhập


  const [xemDanhSach, setXemDanhSach] = useState(false);
  const [hienBauCu, setHienBauCu] = useState(false);
  const [xemThongTin, setXemThongTin] = useState(null);

  const[donViBauCu, setDonViBauCu] = useState(null);
  const[danhSachUngCuVien, setDanhSachUngCuVien] = useState([]);
  const[dotBauCu, setDotBauCu] = useState(null);

  const [daThamGia, setDaThamGia] = useState(false);

  const [chonUngCu, setChonUngCu] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/ungcuvien/lay-theocutri");
        if (response.data.success && response.data.data) {
          setDotBauCu(response.data.data.dotBauCu || {});
          setDonViBauCu(response.data.data.donViBauCu || {});
          setDanhSachUngCuVien(response.data.data.ungCuViens || []);
          const idDotBauCu = response.data.data.dotBauCu?._id;

          if (idDotBauCu) {
            const response2 = await axios.get(`/api/cutri/kiemtrathamgia?idDotBauCu=${idDotBauCu}`);
            setDaThamGia(response2.data.daThamGia || false);
          }
        } else {
          setError("Không có Đợt bầu cử nào Đang diễn ra");
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setError("Lỗi khi kết nối đến server");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  const handleSelectCandidate = (candidateId) => {
    setChonUngCu((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      } else {
        if (prev.length < 3) {
          return [...prev, candidateId];
        }
        return prev;
      }
    });
  };

  const handleSubmit = async () => {
    if (!matKhau.trim()) {
        alert("Vui lòng nhập Private Key để tiếp tục!");
        return;
    }

    try {
        await axios.post("/api/cutri/themphieubau", {
            matKhau: matKhau,
            ungCuVien: chonUngCu,
            idDotBauCu: dotBauCu._id,
            idDonViBauCu: donViBauCu._id
        });
        alert("Gửi phiếu bầu thành công!");
        setChonUngCu([]);
        setHienBauCu(false);
        setMatKhau("");
        setHienNhapKey(false);
    } catch (err) {
        console.error("Lỗi khi gửi phiếu bầu:", err);
        alert("Lỗi khi gửi phiếu bầu!");
    }
  };

  const handleClickKQ = () => {
    console.log("ID Đơn vị bầu cử:", donViBauCu?._id); // Kiểm tra ID có tồn tại không
    if (!donViBauCu?._id) {
      alert("Không tìm thấy ID Đơn vị bầu cử!");
      return;
    }
    navigate("/result", { state: { idDonViBauCu: donViBauCu._id } });
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      window.location.href = "/";
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return (
<div className="flex flex-col items-center justify-center">
  <div className="bg-blue-900 w-full flex items-center justify-between p-4 shadow-md">
    <h2 className="text-white font-bold text-lg">Bầu Cử Quốc Hội</h2>
    <div className="flex items-center gap-4">
      <button className="bg-amber-200 p-3 rounded-full hover:bg-amber-300 transition-all">
        <FaUser className="text-blue-900 text-lg" />
      </button>
      <button onClick={handleLogout} className="text-white text-lg">
        <AiOutlineLogout />
      </button>
    </div>
  </div>
  <p className="text-gray-600 mt-4 text-lg font-semibold">{error}</p>
  <button 
    className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    onClick={() => window.location.reload()}
  >
    Thử lại
  </button>
</div>
  );
  // if (!dotBauCu || !donViBauCu || !danhSachUngCuVien) return <div>Không có đợt bầu cử nào</div>;

  return (
    <div className="bg-gray-100 w-full min-h-screen flex flex-col">
      <div className="bg-blue-900 w-full flex items-center justify-between p-4 shadow-md">
        <h2 className="text-white font-bold text-lg">Bầu Cử Quốc Hội</h2>
        <button className="bg-amber-200 p-3 rounded-full hover:bg-amber-300 transition-all">
          <FaUser className="text-blue-900 text-lg" />
        </button>
      </div>

      <div className="container mx-auto mt-6 px-6">
        <div className="text-center mb-6">
          <h1 className="font-black text-3xl text-blue-900">
            {dotBauCu?.tenDotBauCu}
          </h1>
          <h2 className="font-semibold text-xl text-blue-900">
            {moment(dotBauCu?.ngayBatDau).format("DD/MM/YYYY hh:mm:ss")} - {moment(dotBauCu?.ngayKetThuc).format("DD/MM/YYYY hh:mm:ss")}
          </h2>
          <h3 className="font-semibold text-lg text-gray-700 mt-2">
            DANH SÁCH CHÍNH THỨC NHỮNG NGƯỜI ỨNG CỬ THEO TỪNG ĐƠN VỊ BẦU CỬ TRONG CẢ NƯỚC
          </h3>
        </div>
        <div className="w-full flex justify-end mb-6">
          <button
            className="cursor-pointer bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all"
            onClick={handleClickKQ}
            >
            Xem kết quả
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <div>
            <h5 className="font-bold text-lg text-blue-800">
              {donViBauCu?.capTinh?.ten} 
              <span className="text-gray-700 font-normal ml-3">
                SỐ ĐƠN VỊ BẦU CỬ LÀ 10
              </span>
            </h5>

            <p className="text-gray-600 mt-2">
              <strong>Số đại biểu Quốc hội được bầu:</strong> 29 người.{" "}
              <strong>Số người ứng cử:</strong> 49 người.
            </p>
            <p className="text-gray-600">
              <strong>UBBC Tỉnh/Thành phố:</strong> {donViBauCu?.capTinh?.ten} 
            </p>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="font-bold text-blue-700">
                  {donViBauCu?.tenDonVi}{": "}
                  <span className="text-gray-700">
                    Gồm: {donViBauCu?.capHuyen?.map((item) => item.ten).join(", ")}.
                  </span>
                </h5>
                <p className="text-gray-600">
                  <strong>Số đại biểu Quốc hội được bầu:</strong> {donViBauCu?.soDaiBieuDuocBau}.
                </p>
                <p className="text-gray-600">
                  <strong>Số người ứng cử:</strong> {donViBauCu?.danhSachUngCu?.length}.
                </p>
                <a className="text-blue-700 font-semibold mt-2 block cursor-pointer hover:underline" onClick={() => setXemDanhSach(!xemDanhSach)}>
                  {xemDanhSach ? "Ẩn danh sách ứng cử viên" : "Xem danh sách ứng cử viên"}
                </a>
              </div>
              {!daThamGia ? (
                <button
                  className={`bg-blue-600 text-white px-6 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition-all`}
                  onClick={() => setHienBauCu(!hienBauCu)}
                >
                  Bầu cử
                </button>
              ) : (
                <p>Đã bầu cử</p>
              )}

            </div>

            {xemDanhSach && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <h5 className="mb-6 font-bold text-blue-700 uppercase text-2xl text-center">
                  Danh sách ứng cử viên
                </h5>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {danhSachUngCuVien.map((ungVien, index) => (
                    <div key={ungVien.id} className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center relative" onClick={() => setXemThongTin(xemThongTin ? null : ungVien)}> 
                      <div className="absolute -top-2 -left-2 bg-blue-700 text-white w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold shadow-md">
                        {index + 1}
                      </div>
                      <img
                        src={ungVien.hinhAnh}
                        alt={ungVien.hoVaTen}
                        className="w-full h-70 rounded-lg object-cover border-2 border-white shadow-sm"
                      />
                      <p className="text-gray-800 font-semibold text-lg mt-4 text-center">
                        {ungVien.hoVaTen}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {xemThongTin && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900/50 flex items-center justify-center">
          <div className="bg-blue-200 p-8 rounded-lg shadow-lg w-200 border border-gray-400 relative">
            <button
              className="absolute cursor-pointer top-0 right-3 text-gray-700 hover:text-red-600 transition text-xl mt-2 mb-2"
              onClick={() => setXemThongTin(null)}
            >
              X
            </button>
            <div className="text-center">
              <img
                src={xemThongTin.hinhAnh}
                alt={xemThongTin.hoVaTen}
                className="w-40 h-50 rounded-lg object-cover border-2 border-white shadow-md mx-auto"
              />
              <div className="mt-3 text-left">
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Họ và tên:</span> {xemThongTin.hoVaTen}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Tuổi:</span> {xemThongTin.ngaySinh}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Giới tính:</span> {xemThongTin.gioiTinh}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Quốc tịch:</span> {xemThongTin.quocTich}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Dân tộc:</span> {xemThongTin.danToc}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Tôn giáo:</span> {xemThongTin.tonGiao}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Quê quán:</span> {xemThongTin.queQuan.capXa.ten}, {xemThongTin.queQuan.capHuyen.ten}, {xemThongTin.queQuan.capTinh.ten}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Nơi ở hiện nay:</span> {xemThongTin.noiO}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Giáo dục phổ thông:</span> {xemThongTin.trinhDoHocVan.phoThong}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Chuyên môn, nghiệp vụ:</span> {xemThongTin.trinhDoHocVan.chuyenMon}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Học hàm, học vị:</span> {xemThongTin.trinhDoHocVan.hocVi}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Lý luận chính trị:</span> {xemThongTin.trinhDoHocVan.lyLuan}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Ngoại ngữ:</span> {xemThongTin.trinhDoHocVan.ngoaiNgu}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Nghề nghiệp, chức vụ:</span> {xemThongTin.ngheNghiep}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Nơi công tác:</span> {xemThongTin.noiCongTac}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Ngày vào Đảng:</span> {xemThongTin.ngayVaoDang}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Là đại biểu QH:</span> {xemThongTin.laDaiBieuQH}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Là đại biểu HĐND:</span> {xemThongTin.laDaiBieuHDND}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


      {hienBauCu && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900/50 flex items-center justify-center">
          <div className="bg-blue-200 p-8 rounded-lg shadow-lg w-120 relative">
            <button
                className="absolute cursor-pointer top-0 right-3 text-gray-700 hover:text-red-600 transition text-xl mt-2 mb-2"
                onClick={() => setHienBauCu(false)}
                >
                X
              </button>
            <div className="text-center flex justify-between">
              <span>
                <p className="text-sm font-semibold">Đơn vị bầu cử số: 1</p>
                <p className="text-sm font-semibold">Tỉnh Hòa Bình</p>
              </span>
              <span>
                <h2 className="text-sm font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
                <p className="text-sm font-semibold">Độc lập - Tự do - Hạnh phúc</p>
                <hr className="mx-15 my-2" />
              </span>
            </div>

            <h3 className="text-center font-bold text-xl mt-10">PHIẾU BẦU CỬ</h3>
            <p className="text-center text-xl font-bold">ĐẠI BIỂU QUỐC HỘI KHÓA XV</p>
            <hr className="mx-40 my-2" />
            <p className="text-center mt-5 text-lg font-bold">Được bầu {donViBauCu.soDaiBieuDuocBau} đại biểu</p>

            <div className="mt-10 mx-20">
              {danhSachUngCuVien.map((candidate, index) => (
                <div key={index} className="text-gray-900 font-semibold text-lg">
                  <label
                    className={`cursor-pointer ${chonUngCu.includes(candidate._id) ? 'text-blue-600 font-bold' : ''}`} 
                    onClick={() => handleSelectCandidate(candidate._id)}
                  >
                    <input
                      type="checkbox"
                      value={candidate._id}
                      onChange={() => handleSelectCandidate(candidate._id)}
                      checked={chonUngCu.includes(candidate._id)}
                      disabled={chonUngCu.length >= donViBauCu.soDaiBieuDuocBau && !chonUngCu.includes(candidate._id)}
                      className="hidden"
                    />
                    {candidate.gioiTinh === 'Nam' ? 'Ông' : 'Bà'}
                    <span className="ml-7 uppercase">{candidate.hoVaTen}</span>
                  </label>
                </div>
              ))}
            </div>



            <div className="text-center mt-10">
              <button
                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => setHienNhapKey(true)}
              >
                Gửi phiếu bầu
              </button>
            </div>
          </div>
        </div>
      )}
      {hienNhapKey && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition text-2xl cursor-pointer"
              onClick={() => {
                setHienNhapKey(false);
                setMatKhau("");
              }}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Xác nhận bầu cử
            </h2>
            <input
              type="password"
              placeholder="Nhập Mật Khẩu"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={handleSubmit}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}


      
    </div>
  );
}

export default HomePage;

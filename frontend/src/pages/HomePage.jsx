import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [xemDanhSach, setXemDanhSach] = useState(false);
  const [hienBauCu, setHienBauCu] = useState(false);
  const [xemThongTin, setXemThongTin] = useState(false);

  const danhSachUngCuVien = [
    { id: 1, ten: "Nguyễn Văn A", hinhAnh: "https://via.placeholder.com/100", gender: "Nam" },
    { id: 2, ten: "Trần Thị B", hinhAnh: "https://via.placeholder.com/100", gender: "Nữ" },
    { id: 3, ten: "Phạm Văn C", hinhAnh: "https://via.placeholder.com/100", gender: "Nam" },
    { id: 4, ten: "Lê Thị D", hinhAnh: "https://via.placeholder.com/100", gender: "Nữ" },
    { id: 5, ten: "Đỗ Văn E", hinhAnh: "https://via.placeholder.com/100", gender: "Nam" }
  ];

  const [chonUngCu, setChonUngCu] = useState([]);

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

  const handleSubmit = () => {
    if (chonUngCu.length === 3) {
      console.log('Gửi phiếu bầu với các đại biểu:', chonUngCu);
      alert('Gửi phiếu bầu thành công!');
      setHienBauCu(false);
      setChonUngCu([]);
    } else {
      alert('Vui lòng chọn đủ 3 đại biểu!');
    }
  };

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
            Bầu cử đại biểu Quốc hội khóa XII và đại biểu HĐND
          </h1>
          <h3 className="font-semibold text-lg text-gray-700 mt-2">
            DANH SÁCH CHÍNH THỨC NHỮNG NGƯỜI ỨNG CỬ ĐẠI BIỂU KHOÁ XV THEO TỪNG
            ĐƠN VỊ BẦU CỬ TRONG CẢ NƯỚC
          </h3>
        </div>
        <div className="w-full flex justify-end mb-6">
          <button
            className="cursor-pointer bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all"
            onClick={() => navigate("/result")}
          >
            Xem kết quả
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <div>
            <h5 className="font-bold text-lg text-blue-800">
              THÀNH PHỐ HÀ NỘI:{" "}
              <span className="text-gray-700 font-normal">
                SỐ ĐƠN VỊ BẦU CỬ LÀ 10
              </span>
            </h5>

            <p className="text-gray-600 mt-2">
              <strong>Số đại biểu Quốc hội được bầu:</strong> 29 người.{" "}
              <strong>Số người ứng cử:</strong> 49 người.
            </p>
            <p className="text-gray-600">
              <strong>UBBC Tỉnh/Thành phố:</strong> Thành phố Hà Nội
            </p>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="font-bold text-blue-700">
                  Đơn vị bầu cử Số 1:{" "}
                  <span className="text-gray-700">
                    Gồm các quận: Ba Đình, Đống Đa và Hai Bà Trưng.
                  </span>
                </h5>
                <p className="text-gray-600">
                  <strong>Số đại biểu Quốc hội được bầu:</strong> 3 người.
                </p>
                <p className="text-gray-600">
                  <strong>Số người ứng cử:</strong> 5 người.
                </p>
                <a className="text-blue-700 font-semibold mt-2 block cursor-pointer hover:underline" onClick={() => setXemDanhSach(!xemDanhSach)}>
                  {xemDanhSach ? "Ẩn danh sách ứng cử viên" : "Xem danh sách ứng cử viên"}
                </a>
              </div>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition-all"
                onClick={() => setHienBauCu(!hienBauCu)}
              >
                Bầu cử
              </button>
            </div>

            {xemDanhSach && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <h5 className="mb-6 font-bold text-blue-700 uppercase text-2xl text-center">
                  Danh sách ứng cử viên
                </h5>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {danhSachUngCuVien.map((ungVien, index) => (
                    <div key={ungVien.id} className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center relative" onClick={() => setXemThongTin(!xemThongTin)}> 
                      <div className="absolute -top-2 -left-2 bg-blue-700 text-white w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold shadow-md">
                        {index + 1}
                      </div>
                      <img
                        src={ungVien.hinhAnh}
                        alt={ungVien.ten}
                        className="w-full h-70 rounded-lg object-cover border-2 border-white shadow-sm"
                      />
                      <p className="text-gray-800 font-semibold text-lg mt-4 text-center">
                        {ungVien.ten}
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
          <div className="bg-blue-200 p-8 rounded-lg shadow-lg w-120 border border-gray-400 relative">
            <button
              className="absolute cursor-pointer top-0 right-3 text-gray-700 hover:text-red-600 transition text-xl mt-2 mb-2"
              onClick={() => setXemThongTin(false)}
            >
              X
            </button>
            <div className="text-center">
              <img
                src="https://via.placeholder.com/100"
                alt="Nguyễn Văn A"
                className="w-40 h-50 rounded-lg object-cover border-2 border-white shadow-md mx-auto"
              />
              <h3 className="text-lg font-bold mt-4">Nguyễn Văn A</h3>
              <div className="mt-3 text-left">
                <p className="text-sm text-gray-700">Giới tính: Nam</p>
                <p className="text-sm text-gray-700">Tuổi: 45</p>
                <p className="text-sm text-gray-700">Nghề nghiệp: Giáo viên</p>
                <p className="text-sm text-gray-700">Địa chỉ: Hà Nội</p>
                <p className="text-sm text-gray-700">Số phiếu bầu: 100</p>
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

            <h3 className="text-center font-bold text-xl mt-15">PHIẾU BẦU CỬ</h3>
            <p className="text-center text-xl font-bold">ĐẠI BIỂU QUỐC HỘI KHÓA XV</p>
            <hr className="mx-40 my-2" />
            <p className="text-center mt-5 text-lg font-bold">Được bầu 3 đại biểu</p>

            <div className="mt-10 mx-20">
              {danhSachUngCuVien.map((candidate, index) => (
                <div key={index} className="text-gray-900 font-semibold text-lg">
                  <label
                    className={`cursor-pointer ${chonUngCu.includes(candidate.id) ? 'text-red-500' : ''}`} 
                    onClick={() => handleSelectCandidate(candidate.id)}
                  >
                    <input
                      type="checkbox"
                      value={candidate.id}
                      onChange={() => handleSelectCandidate(candidate.id)}
                      checked={chonUngCu.includes(candidate.id)}
                      disabled={chonUngCu.length >= 3 && !chonUngCu.includes(candidate.id)}
                      className="hidden"
                    />
                    {candidate.gender === 'Nam' ? 'Ông' : 'Bà'}
                    <span className="ml-7 uppercase">{candidate.ten}</span>
                  </label>
                </div>
              ))}
            </div>



            <div className="text-center mt-10">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={handleSubmit}
              >
                Gửi phiếu bầu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;

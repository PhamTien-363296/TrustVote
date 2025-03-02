import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const initialCandidates = [
  {
    id: 1,
    name: "Bò Xanh Uy Vũ",
    position: "Chúa tể sơn lâm",
    startDate: "2025-03-02",
    endDate: "2025-04-02",
    info: "Có 3 năm kinh nghiệm về Node.js và MongoDB",
    avatar: "https://i.pinimg.com/474x/b8/90/ec/b890eccedf78a9146a627e7c48ed758f.jpg",
    closed: false,
  },
  {
    id: 2,
    name: "Tắc Kè Lực Lưỡng",
    position: "Chúa tể sơn lâm",
    startDate: "2025-02-28",
    endDate: "2025-03-30",
    info: "Chuyên về React và Tailwind CSS",
    avatar: "https://i.pinimg.com/736x/88/8a/5f/888a5f98e1046867774a54b6213d53aa.jpg",
    closed: false,
  },
];

export const AdminCandidates = () => {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [showForm, setShowForm] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    position: "",
    startDate: "",
    endDate: "",
    info: "",
    avatar: "",
    closed: false,
  });

  const handleChange = (e) => {
    setNewCandidate({ ...newCandidate, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewCandidate({ ...newCandidate, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCandidates([...candidates, { ...newCandidate, id: candidates.length + 1 }]);
    setShowForm(false);
    setNewCandidate({ name: "", position: "", startDate: "", endDate: "", info: "", avatar: "", closed: false });
  };

  const closeElection = (id) => {
    setCandidates(candidates.map(candidate => candidate.id === id ? { ...candidate, closed: true } : candidate));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="w-full max-w-screen-2xl bg-white p-10 rounded-xl shadow-xl border border-gray-200">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Quản Lý Ứng Viên</h2>
        <button onClick={() => setShowForm(true)} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition">
          <FaPlus /> Thêm Ứng Viên
        </button>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] flex">
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" id="avatarUpload" />
              <label htmlFor="avatarUpload" className="cursor-pointer w-2/3 h-85 bg-gray-200 flex items-center justify-center rounded-md ">
                {newCandidate.avatar ? <img src={newCandidate.avatar} alt="Avatar" className="w-full h-full object-cover" /> : "Chọn ảnh"}
              </label>
              <div className="w-2/3 pl-4">
                <h3 className="text-2xl font-bold mb-4">Thêm Ứng Viên</h3>
                <input type="text" name="name" placeholder="Tên" className="p-3 border rounded w-full mt-3" onChange={handleChange} required />
                <textarea name="position" placeholder="Vị trí ứng tuyển" className="p-3 border rounded w-full mt-3 resize-none break-words" onChange={handleChange} required />
                <input type="date" name="startDate" className="p-3 border rounded w-full mt-3" onChange={handleChange} required />
                <input type="date" name="endDate" className="p-3 border rounded w-full mt-3" onChange={handleChange} required />
                <textarea name="info" placeholder="Thông tin thêm" className="p-3 border rounded w-full mt-3 resize-none break-words" onChange={handleChange} required />
                <div className="flex justify-between mt-4">
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg">Hủy</button>
                  <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Thêm</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-md text-left">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-4">Ảnh</th>
              <th className="p-4">Tên</th>
              <th className="p-4">Vị Trí Ứng Tuyển</th>
              <th className="p-4">Ngày Bắt Đầu</th>
              <th className="p-4">Ngày Kết Thúc</th>
              <th className="p-4">Thông Tin</th>
              <th className="p-4">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(candidate => (
              <tr key={candidate.id} className="text-gray-700 bg-gray-50 hover:bg-gray-100 transition">
                <td className="p-4 text-center">
                  <img src={candidate.avatar} alt={candidate.name} className="w-40 h-28 object-cover mx-auto border border-gray-300 shadow-sm rounded-lg" />
                </td>
                <td className="p-4">{candidate.name}</td>
                <td className="p-4 break-words max-w-xs">{candidate.position}</td>
                <td className="p-4">{candidate.startDate}</td>
                <td className="p-4">{candidate.endDate}</td>
                <td className="p-4 break-words max-w-xs">{candidate.info}</td>
                <td className="p-4">
                  <button onClick={() => closeElection(candidate.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                     Đóng
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

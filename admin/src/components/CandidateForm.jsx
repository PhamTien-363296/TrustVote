import { MdClose } from "react-icons/md";

const CandidateForm = ({ 
    setMoThem, 
    setCapHuyenList, 
    setUngCuVienMoi, 
    ungCuVienMoi, 
    handleSubmit, 
    handleChange, 
    handleChange2, 
    xuLyThayDoiCapTinh, 
    xuLyChonHuyen, 
    xuLyChonXa, 
    capTinhList, 
    capHuyenList, 
    capXaList, 
    donViBauCuList,
    handleImageChange
}) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
            <div className="bg-white w-96 md:w-230 p-7 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute top-3 right-3 text-lg p-2 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white transition"
                    onClick={() => {
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
                    }}
                >
                    <MdClose />
                </button>
                <h1 className="text-2xl font-bold text-blue-900 text-center mb-5">TẠO ỨNG CỬ VIÊN MỚI</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700 border-b-2 uppercase text-center pb-2">Thông Tin Chung</h2>
                    <div>
                        <label className="block font-medium mb-2">Đơn vị bầu cử:</label>
                        <select
                            name="idDonViBauCu"
                            value={ungCuVienMoi.idDonViBauCu || ""}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Chọn đơn vị bầu cử</option>
                            {donViBauCuList.map(donvi => (
                                <option key={donvi._id} value={donvi._id}>{donvi.tenDonVi}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Hình ảnh của ứng cử viên:</label>
                        <input 
                        type="file" 
                        accept="image/*" 
                        className="w-full border rounded-md p-2 focus:ring focus:ring-emerald-400 text-sm"
                        onChange={handleImageChange} 
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Họ và tên:</label>
                        <input
                            type="text"
                            name="hoVaTen"
                            value={ungCuVienMoi.hoVaTen}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="Nhập họ và tên..."
                        />
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                        <div>
                            <label className="block font-medium mb-1">Ngày sinh:</label>
                            <input
                                type="date"
                                name="ngaySinh"
                                value={ungCuVienMoi.ngaySinh}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Giới tính:</label>
                            <select
                                name="gioiTinh"
                                value={ungCuVienMoi.gioiTinh}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Quốc tịch:</label>
                            <input
                                type="text"
                                name="quocTich"
                                value={ungCuVienMoi.quocTich}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                placeholder="Ví dụ: Việt Nam"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Dân tộc:</label>
                            <input
                                type="text"
                                name="danToc"
                                value={ungCuVienMoi.danToc}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ví dụ: Kinh, Hoa,... "
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Tôn giáo:</label>
                            <input
                                type="text"
                                name="tonGiao"
                                value={ungCuVienMoi.tonGiao}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ví dụ: Phật giáo, Công giáo,... "
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block font-medium mb-1">Tỉnh / Thành phố:</label>
                                <select 
                                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={xuLyThayDoiCapTinh}
                                >
                                    <option value="">Chọn tỉnh/thành</option>
                                    {capTinhList.map(tinh => (
                                        <option key={tinh.code} value={tinh.code}>{tinh.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Quận / Huyện:</label>
                                <select 
                                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={xuLyChonHuyen}
                                >
                                    <option value="">Chọn quận/huyện</option>
                                    {capHuyenList.map(huyen => (
                                        <option key={huyen.code} value={huyen.code}>{huyen.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Xã / Phường:</label>
                                <select 
                                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={xuLyChonXa}
                                    disabled={capXaList.length === 0}
                                >
                                    <option value="">Chọn xã/phường</option>
                                    {capXaList.map(xa => (
                                        <option key={xa.code} value={xa.code}>{xa.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2 bg-gray-100 p-4 rounded-lg border border-gray-300">
                            <p className="font-semibold">Quê quán:</p>
                            <p>
                                <span>{ungCuVienMoi?.queQuan?.capTinh?.name || "Chưa chọn"}</span>,  
                                <span> {ungCuVienMoi?.queQuan?.capHuyen?.name || "Chưa chọn"}</span>,  
                                <span> {ungCuVienMoi?.queQuan?.capXa?.name || "Chưa chọn"}</span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium mb-2">Địa chỉ cụ thể:</label>
                        <input
                            type="text"
                            name="noiO"
                            value={ungCuVienMoi.noiO}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="Nhập chi tiết địa chỉ..."
                        />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700 border-b-2 uppercase text-center pb-2">Trình Độ Học Vấn</h2>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-1">
                                <label className="block font-medium mb-1">Giáo dục phổ thông:</label>
                                <input 
                                    type="text" 
                                    name="phoThong"
                                    value={ungCuVienMoi.trinhDoHocVan.phoThong}
                                    onChange={handleChange2}
                                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ví dụ: 12/12"
                                />
                            </div>
                            <div className="col-span-3">
                                <label className="block font-medium mb-1">Chuyên môn, nghiệp vụ:</label>
                                <input 
                                    type="text" 
                                    name="chuyenMon"
                                    value={ungCuVienMoi.trinhDoHocVan.chuyenMon}
                                    onChange={handleChange2}
                                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ví dụ: Đại học chuyên ngành..."
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block font-medium mb-1">Học hàm, học vị:</label>
                                <input 
                                    type="text" 
                                    name="hocVi"
                                    value={ungCuVienMoi.trinhDoHocVan.hocVi}
                                    onChange={handleChange2}
                                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ví dụ: Cử nhân, Thạc sĩ"
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Lý luận chính trị:</label>
                                <input 
                                    type="text" 
                                    name="lyLuan"
                                    value={ungCuVienMoi.trinhDoHocVan.lyLuan}
                                    onChange={handleChange2}
                                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập trình độ lý luận"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block font-medium mb-1">Ngoại ngữ:</label>
                                <input 
                                    type="text" 
                                    name="ngoaiNgu"
                                    value={ungCuVienMoi.trinhDoHocVan.ngoaiNgu}
                                    onChange={handleChange2}
                                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ví dụ: Tiếng Anh B2, Tiếng Hàn TOPIK 4,..."
                                />
                            </div>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-700 border-b-2 uppercase text-center pb-2">Thông Tin Công Tác</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block font-medium mb-1">Nghề nghiệp, chức vụ:</label>
                                <textarea 
                                    name="ngheNghiep"
                                    value={ungCuVienMoi.ngheNghiep}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    placeholder="Nhập nghề nghiệp, chức vụ..."
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Nơi công tác:</label>
                                <input 
                                    type="text" 
                                    name="noiCongTac"
                                    value={ungCuVienMoi.noiCongTac}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập nơi công tác..."
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Ngày vào Đảng:</label>
                                <input 
                                    type="date" 
                                    name="ngayVaoDang"
                                    value={ungCuVienMoi.ngayVaoDang}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Là đại biểu Quốc hội:</label>
                                <input 
                                    type="text" 
                                    name="laDaiBieuQH"
                                    value={ungCuVienMoi.laDaiBieuQH}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập thông tin nhiệm kỳ..."
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Là đại biểu HĐND:</label>
                                <input 
                                    type="text" 
                                    name="laDaiBieuHDND"
                                    value={ungCuVienMoi.laDaiBieuHDND}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập thông tin nhiệm kỳ..."
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-800 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-900 transition"
                    >
                        Thêm ứng cử viên
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CandidateForm;

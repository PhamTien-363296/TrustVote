import { MdClose } from "react-icons/md";

const CandidateDetail = ({ moChiTiet, setMoChiTiet, ungCuVien }) => {
    if (!moChiTiet || !ungCuVien) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
            <div className="bg-white text-lg w-96 md:w-230 p-7 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute top-3 right-3 text-lg p-2 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white transition"
                    onClick={() => {
                        setMoChiTiet(false);
                    }}
                >
                    <MdClose />
                </button>
                <h1 className="text-2xl font-bold text-blue-900 text-center mb-5">THÔNG TIN CHI TIẾT</h1>
                <div className="flex justify-center mb-6">
                    <img
                        src={ungCuVien.hinhAnh || "https://via.placeholder.com/150"}
                        alt="Ảnh ứng cử viên"
                        className="w-36 h-36 object-cover rounded-lg shadow-md border"
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-3 text-gray-700 text-center border-b pb-3">Thông tin cá nhân</h3>
                        <p><strong>Họ và tên:</strong> {ungCuVien.hoVaTen}</p>
                        <p><strong>Giới tính:</strong> {ungCuVien.gioiTinh}</p>
                        <p><strong>Ngày sinh:</strong> {new Date(ungCuVien.ngaySinh).toLocaleDateString()}</p>
                        <p><strong>Quốc tịch:</strong> {ungCuVien.quocTich}</p>
                        <p><strong>Dân tộc:</strong> {ungCuVien.danToc}</p>
                        <p><strong>Tôn giáo:</strong> {ungCuVien.tonGiao}</p>
                        <p><strong>Nơi ở:</strong> {ungCuVien.noiO}</p>
                        <p><strong>Nghề nghiệp:</strong> {ungCuVien.ngheNghiep}</p>
                        <p><strong>Nơi công tác:</strong> {ungCuVien.noiCongTac}</p>
                        <p><strong>Là đại biểu QH:</strong> {ungCuVien.laDaiBieuQH}</p>
                        <p><strong>Là đại biểu HĐND:</strong> {ungCuVien.laDaiBieuHDND}</p>
                        <p><strong>Trạng thái:</strong> <span className="text-blue-600 font-semibold">{ungCuVien.trangThai}</span></p>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-3 text-gray-700 text-center border-b pb-3">Thông tin bổ sung</h3>
                        <p><strong>Quê quán:</strong></p>
                        <ul className="list-disc pl-5 text-gray-600">
                            <li><strong>Tỉnh:</strong> {ungCuVien.queQuan?.capTinh?.ten}</li>
                            <li><strong>Huyện:</strong> {ungCuVien.queQuan?.capHuyen?.ten}</li>
                            <li><strong>Xã:</strong> {ungCuVien.queQuan?.capXa?.ten}</li>
                        </ul>
                        <p className="mt-3"><strong>Trình độ học vấn:</strong></p>
                        <ul className="list-disc pl-5 text-gray-600">
                            <li><strong>Phổ thông:</strong> {ungCuVien.trinhDoHocVan?.phoThong}</li>
                            <li><strong>Chuyên môn:</strong> {ungCuVien.trinhDoHocVan?.chuyenMon}</li>
                            <li><strong>Học vị:</strong> {ungCuVien.trinhDoHocVan?.hocVi}</li>
                            <li><strong>Lý luận:</strong> {ungCuVien.trinhDoHocVan?.lyLuan}</li>
                            <li><strong>Ngoại ngữ:</strong> {ungCuVien.trinhDoHocVan?.ngoaiNgu?.join(", ")}</li>
                        </ul>
                        
                        <p className="mt-3"><strong>Ngày vào Đảng:</strong> {new Date(ungCuVien.ngayVaoDang).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDetail;

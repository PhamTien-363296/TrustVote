import DonViBauCu from '../models/donvibaucu.model.js';
import NguoiDung from '../models/nguoidung.model.js';

import moment from 'moment';

const taoMaDonViBauCu = (thoiGianTao) => {
    const formattedStartDate = moment(thoiGianTao).format("YYMMDD");
    const randomString = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `DVBC${formattedStartDate}${randomString}`;
};

export const themDonViBauCu = async (req, res) => {
    try {
        const {
            idDotBauCu,
            tenDonVi,
            capTinh,
            capHuyen,
            soDaiBieuDuocBau,
        } = req.body;
        const idNguoiTao = req.nguoidung._id;

        const nguoiTao = await NguoiDung.findById(idNguoiTao);
        if (!nguoiTao) {
            return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        }

        if (nguoiTao.roleND !== "DISTRICT_MANAGER") {
            return res.status(403).json({ message: "Bạn không có quyền thêm đơn vị bầu cử!" });
        }

        const maDonViBauCu = taoMaDonViBauCu(new Date());

        const donViMoi = new DonViBauCu({
            idDotBauCu,
            maDonViBauCu,
            tenDonVi,
            capTinh: {
                id: capTinh.id,
                ten: capTinh.name,
            },
            capHuyen: capHuyen.map((huyen) => ({
                id: huyen.id,
                ten: huyen.name,
            })),
            soDaiBieuDuocBau,
            idNguoiTao
        });

        await donViMoi.save();

        return res.status(201).json({
            message: "Thêm đơn vị bầu cử thành công!",
            donViBauCu: donViMoi
        });
    } catch (error) {
        console.error("Lỗi khi thêm đơn vị bầu cử:", error);
        return res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};

export const layDanhSachDonViBauCu = async (req, res) => {
    try {
        const danhSachDonVi = await DonViBauCu.find()
        .populate("idNguoiTao", "username")
        .populate({
            path: "idNguoiDuyet",
            select: "username",
            match: { _id: { $ne: null } } // Chỉ populate nếu khác null
        })
        .sort({ tenDonVi: 1 });

        return res.status(200).json(danhSachDonVi);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn vị bầu cử:", error);
        return res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};

export const xoaDonViBauCu = async (req, res) => {
    try {
        const { id } = req.params;
        const idNguoiXoa = req.nguoidung._id;

        const donViBauCu = await DonViBauCu.findById(id);
        if (!donViBauCu) {
            return res.status(404).json({ message: "Không tìm thấy đơn vị bầu cử!" });
        }

        if (donViBauCu.idNguoiTao.toString() !== idNguoiXoa.toString()) {
            return res.status(403).json({ message: "Bạn không có quyền xóa đơn vị bầu cử này!" });
        }

        if (donViBauCu.trangThai !== "Chờ xét duyệt" && donViBauCu.trangThai !== "Từ chối") {
            return res.status(400).json({
                message: "Chỉ có thể xóa đơn vị bầu cử khi đang Chờ xét duyệt hoặc Từ chối!",
            });
        }

        await DonViBauCu.findByIdAndDelete(id);
        res.status(200).json({ message: "Xóa đơn vị bầu cử thành công!" });

    } catch (error) {
        console.error("Lỗi xoaDonViBauCu controller:", error.message);
        res.status(500).json({ message: "Lỗi máy chủ!", error: error.message });
    }
};

export const capNhatTrangThaiDonVi = async (req, res) => {
    try {
        const { id } = req.params;
        const { trangThaiMoi } = req.body;
        const idNguoiDuyet = req.nguoidung._id;

        const nguoiDuyet = await NguoiDung.findById(idNguoiDuyet);
        if (!nguoiDuyet) {
            return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        }

        if (nguoiDuyet.roleND !== "ELECTION_VERIFIER") {
            return res.status(403).json({ message: "Bạn không có quyền cập nhật trạng thái!" });
        }

        const donVi = await DonViBauCu.findById(id);
        if (!donVi) {
            return res.status(404).json({ message: "Không tìm thấy đơn vị bầu cử!" });
        }

        if (donVi.trangThai !== "Chờ xét duyệt") {
            return res.status(400).json({
                message: "Chỉ có thể cập nhật khi trạng thái là 'Chờ xét duyệt'!",
            });
        }

        donVi.trangThai = trangThaiMoi;
        donVi.idNguoiDuyet = idNguoiDuyet;
        donVi.thoiGianDuyet = new Date();

        await donVi.save();

        res.status(200).json({
            message: "Cập nhật trạng thái thành công!"
        });

    } catch (error) {
        console.error("Lỗi capNhatTrangThaiDonVi controller:", error.message);
        res.status(500).json({ message: "Lỗi máy chủ!", error: error.message });
    }
};
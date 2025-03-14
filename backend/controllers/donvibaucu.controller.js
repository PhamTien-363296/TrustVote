import DonViBauCu from '../models/donvibaucu.model.js';
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

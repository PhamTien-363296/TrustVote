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
            tinhThanh,
            capHanhChinh,
            soDaiBieuDuocBau,
        } = req.body;
        const idNguoiTao = req.nguoidung._id;

        const maDonViBauCu = taoMaDonViBauCu(new Date());

        const donViMoi = new DonViBauCu({
            idDotBauCu,
            maDonViBauCu,
            tenDonVi,
            tinhThanh,
            capHanhChinh,
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
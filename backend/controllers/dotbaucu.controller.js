import DotBauCu from "../models/dotbaucu.model.js";
import moment from "moment";

export const layDotBauCu = async (req, res) => {
    try {
        const dotBauCuList = await DotBauCu.find()
        .populate("idNguoiTao", "username")
        .populate({
            path: "idNguoiDuyet",
            select: "username",
            match: { _id: { $ne: null } } // Chỉ populate nếu khác null
        });

        res.status(200).json(dotBauCuList);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách đợt bầu cử!", error });
    }
};

const taoMaDotBauCu = (ngayBatDau) => {
    const formattedStartDate = moment(ngayBatDau).format("YYMMDD");
    const randomString = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `DBC${formattedStartDate}${randomString}`;
};

export const themDotBauCu = async (req, res) => {
    try {
        const { tenDotBauCu, ngayBatDau, ngayKetThuc } = req.body;
        const idNguoiTao = req.nguoidung._id;

        console.log(req.body)

        if (!tenDotBauCu || !ngayBatDau || !ngayKetThuc) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }

        const maDotBauCu = taoMaDotBauCu(ngayBatDau);

        const newDotBauCu = new DotBauCu({
            maDotBauCu,
            tenDotBauCu,
            ngayBatDau,
            ngayKetThuc,
            trangThai: "Chờ xét duyệt",
            idNguoiTao,
            thoiGianTao: new Date(),
        });

        await newDotBauCu.save();
        res.status(201).json({ message: "Đã thêm đợt bầu cử, chờ xét duyệt!", dotBauCu: newDotBauCu });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};


export const xetDuyetDotBauCu = async (req, res) => {
    try {
        const { id } = req.params;
        const { chapThuan } = req.body;

        const dotBauCu = await DotBauCu.findById(id);
        if (!dotBauCu) {
            return res.status(404).json({ message: "Không tìm thấy đợt bầu cử!" });
        }

        if (dotBauCu.trangThai !== "Chờ xét duyệt") {
            return res.status(400).json({ message: "Đợt bầu cử này đã được xét duyệt trước đó!" });
        }

        dotBauCu.trangThai = chapThuan ? "Chưa diễn ra" : "Từ chối";
        await dotBauCu.save();

        res.status(200).json({ message: `Đợt bầu cử đã được ${chapThuan ? "duyệt" : "từ chối"} thành công!`, dotBauCu });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

export const layDotBauCuChuaDienRa = async (req, res) => {
    try {
        const dotBauCuList = await DotBauCu.find({ trangThai: "Chưa diễn ra" });
        res.status(200).json(dotBauCuList);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách đợt bầu cử chưa diễn ra!", error });
    }
};


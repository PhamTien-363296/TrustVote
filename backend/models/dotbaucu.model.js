import mongoose from "mongoose";

const dotBauCuSchema = new mongoose.Schema(
    {
        maDotBauCu: {
            type: String,
            required: true,
        },
        tenDotBauCu: {
            type: String,
            required: true,
        },
        ngayBatDau: {
            type: Date,
            required: true,
        },
        ngayKetThuc: {
            type: Date,
            required: true,
        },
        trangThai: {
            type: String,
            enum: ["Chờ xét duyệt", "Từ chối", "Chưa diễn ra", "Đang diễn ra", "Đã kết thúc"],
            default: "Chờ xét duyệt",
        },
        idDonViBauCu: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "DonViBauCu",
            },
        ],
        idNguoiTao: { type: mongoose.Schema.Types.ObjectId, ref: "Nguoidung", required: true },
        thoiGianTao: { type: Date, default: Date.now }, 

        idNguoiDuyet: { type: mongoose.Schema.Types.ObjectId, ref: "Nguoidung", default: null }, 
        thoiGianDuyet: { type: Date }, 
    },
    { timestamps: true }
);

const DotBauCu = mongoose.model("DotBauCu", dotBauCuSchema, "DotBauCu");

export default DotBauCu;

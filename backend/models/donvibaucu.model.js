import mongoose from "mongoose";

const donViBauCuSchema = new mongoose.Schema(
    {
        idDotBauCu: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DotBauCu",
            required: true,
        },
        maDonViBauCu: {
            type: String,
            required: true,
        },
        tenDonVi: {
            type: String,
            required: true,
        },
        capTinh: {
            id: { type: String },
            ten: { type: String },
        },
        capHuyen: [
            {
                id: { type: String },
                ten: { type: String },
                _id: false
            },
        ],
        soDaiBieuDuocBau: {
            type: Number,
            required: true,
        },
        danhSachUngCu: [
            { type: mongoose.Schema.Types.ObjectId, ref: "UngCuVien" }
        ],

        trangThai: {
            type: String,
            enum: ["Chờ xét duyệt", "Từ chối", "Chưa diễn ra", "Đang diễn ra", "Đã kết thúc"],
            default: "Chờ xét duyệt",
        },
        idNguoiTao: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Nguoidung", 
            required: true 
        },
        thoiGianTao: { 
            type: Date, 
            default: Date.now 
        },

        idNguoiDuyet: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Nguoidung", 
            default: null 
        },
        thoiGianDuyet: { 
            type: Date 
        },
    },
    { timestamps: true }
);

const DonViBauCu = mongoose.model("DonViBauCu", donViBauCuSchema, "DonViBauCu");

export default DonViBauCu;

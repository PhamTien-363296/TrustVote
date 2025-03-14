import mongoose from "mongoose";

const cutriSchema = new mongoose.Schema(
    {
        hoVaTen: {
            type: String,
            required: true,
        },
        cccd: {
            type: String,
            required: true,
            unique: true,
        },
        matKhau: {
            type: String,
            minLength: 6,
        },
        // maDinhDanh: {
        //     type: String,
        // },
        diaChi: {
            capTinh: {
                id: { type: String, required: true },
                ten: { type: String, required: true },
            },
            capHuyen: {
                id: { type: String, required: true },
                ten: { type: String, required: true },
            },
            capXa: {
                id: { type: String, required: true },
                ten: { type: String, required: true },
            },
            diaChiChiTiet: { type: String, required: true },
        },
        trangThai: {
            type: String,
            enum: ["Chờ xét duyệt", "Từ chối", "Chưa kích hoạt", "Hoạt động", "Khóa", "Tạm dừng"],
            default: "Chờ xét duyệt",
        },
        thamGiaBauCu: [
            {
                maDotBauCu: { type: mongoose.Schema.Types.ObjectId, ref: "DotBauCu" },
                ngayBau: { type: Date, default: Date.now }
            }
        ],
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

const CuTri = mongoose.model("CuTri", cutriSchema, "CuTri");

export default CuTri;

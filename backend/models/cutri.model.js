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
        gmail: {
            type: String,
            required: true,
            unique: true,
        },
        matKhau: {
            type: String,
            minLength: 6,
        },
        maDinhDanh: {
            type: String,
            unique: true,
        },
        trangThai: {
            type: String,
            enum: ["Hoạt động", "Khóa", "Tạm dừng"],
            default: "Hoạt động",
        },
        thamGiaBauCu: [
            {
                maDotBauCu: { type: mongoose.Schema.Types.ObjectId, ref: "DotBauCu" },
                ngayBau: { type: Date, default: Date.now }
            }
        ],
    },
    { timestamps: true }
);

const CuTri = mongoose.model("CuTri", cutriSchema, "CuTri");

export default CuTri;

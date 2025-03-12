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
        daBau: {
            type: Boolean,
            default: false,
        },
        trangThai: {
            type: String,
            enum: ["Hoạt động", "Khóa", "Tạm dừng"],
            default: "Hoạt động",
        },
        idDonViBauCu: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DonViBauCu",
        },
    },
    { timestamps: true }
);

const Cutri = mongoose.model("Cutri", cutriSchema, "Cutri");

export default Cutri;

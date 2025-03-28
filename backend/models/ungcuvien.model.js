import mongoose from "mongoose";

const ungcuvienSchema = new mongoose.Schema(
    {
        // maUngCuVien: {
        //     type: String,
        //     required: true,
        //     unique: true, 
        // },
        idDonViBauCu: { type: mongoose.Schema.Types.ObjectId, ref: "DonViBauCu"},
        idDotBauCu: { type: mongoose.Schema.Types.ObjectId, ref: "DotBauCu" },
        hinhAnh: { type: String },
        hoVaTen: {
            type: String,
            required: true,
        },
        ngaySinh: {
            type: Number
        },
        gioiTinh: {
            type: String,
            enum: ["Nam", "Nữ", "Khác"],
        },
        quocTich: {
            type: String,
        },
        danToc: {
            type: String,
        },
        tonGiao: {
            type: String,
        },
        queQuan: {
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
        },
        noiO: {
            type: String,
        },
        trinhDoHocVan: {
            phoThong: { type: String },
            chuyenMon: { type: String },
            hocVi: { type: String },
            lyLuan: { type: String },
            ngoaiNgu: { type: [String] },
        },
        ngheNghiep: {
            type: String,
        },
        noiCongTac: {
            type: String,
        },
        ngayVaoDang: {
            type: Date,
            default: null,
        },
        laDaiBieuQH: {
            type: String,
        },
        laDaiBieuHDND: {
            type: String,
        },
        txHash: {
            type: String,
        },
        trangThai: {
            type: String,
            enum: ["Chờ xét duyệt", "Từ chối", "Chưa diễn ra", "Đang diễn ra", "Đã kết thúc"],
            default: "Chờ xét duyệt",
        },
        idNguoiTao: { type: mongoose.Schema.Types.ObjectId, ref: "Nguoidung", required: true },
        thoiGianTao: { type: Date, default: Date.now }, 

        idNguoiDuyet: { type: mongoose.Schema.Types.ObjectId, ref: "Nguoidung", default: null }, 
        thoiGianDuyet: { type: Date }, 
    },
    { timestamps: true }
);

const UngCuVien = mongoose.model("UngCuVien", ungcuvienSchema, "UngCuVien");

export default UngCuVien;

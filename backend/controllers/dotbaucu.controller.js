import DotBauCu from "../models/dotbaucu.model.js";
import NguoiDung from "../models/nguoidung.model.js";
import DonViBauCu from "../models/donvibaucu.model.js";
import UngCuVien from "../models/ungcuvien.model.js";
import { ethers } from "ethers";
import moment from "moment";
import dotenv from "dotenv" 
import abi from "../abi.js";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.INFURA_API_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = abi; 

export const layDotBauCu = async (req, res) => {
    try {
        const dotBauCuList = await DotBauCu.find()
        .populate("idNguoiTao", "username")
        .populate({
            path: "idNguoiDuyet",
            select: "username",
            match: { _id: { $ne: null } } 
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

        //console.log(req.body)

        if (!tenDotBauCu || !ngayBatDau || !ngayKetThuc) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }

        const nguoiTao = await NguoiDung.findById(idNguoiTao);
        if (!nguoiTao) {
            return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        }

        if (nguoiTao.roleND !== "ELECTION_CREATOR") {
            return res.status(403).json({ message: "Bạn không có quyền tạo đợt bầu cử!" });
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
        const { chapThuan, privateKey } = req.body;
        const idnguoiDuyet = req.nguoidung._id;

        if (!privateKey) {
            return res.status(400).json({ message: "Cần nhập private key để duyệt bầu cử!" });
        }

        // Kiểm tra người duyệt có phải ADMIN không
        const nguoiDuyet = await NguoiDung.findById(idnguoiDuyet);
        if (!nguoiDuyet) {
            return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        }
        if (nguoiDuyet.roleND !== "ADMIN") {
            return res.status(403).json({ message: "Bạn không có quyền duyệt bầu cử!" });
        }

        const dotBauCu = await DotBauCu.findById(id);
        if (!dotBauCu) {
            return res.status(404).json({ message: "Không tìm thấy đợt bầu cử!" });
        }
        if (dotBauCu.trangThai !== "Chờ xét duyệt") {
            return res.status(400).json({ message: "Đợt bầu cử này đã được xét duyệt trước đó!" });
        }

        const provider = new ethers.JsonRpcProvider(process.env.INFURA_API_URL);
        const signer = new ethers.Wallet(privateKey, provider);
        const adminAddress = nguoiDuyet.address; 

        console.log("Signer Address nhập vào:", signer.address);
        console.log("Admin Address từ DB:", adminAddress);

        if (signer.address.toLowerCase() !== adminAddress.toLowerCase()) {
            return res.status(403).json({ message: "Private key không khớp với tài khoản admin!" });
        }

        dotBauCu.trangThai = chapThuan ? "Chưa diễn ra" : "Từ chối";
        dotBauCu.idNguoiDuyet = nguoiDuyet._id;
        await dotBauCu.save();

        if (chapThuan) {
            try {
            
                const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

                const startTime = Math.floor(new Date(dotBauCu.ngayBatDau).getTime() / 1000);
                const endTime = Math.floor(new Date(dotBauCu.ngayKetThuc).getTime() / 1000);

                console.log("Gửi transaction tạo đợt bầu cử...");
                const tx = await contract.createElection(
                    dotBauCu._id.toString(),
                    dotBauCu.tenDotBauCu,
                    startTime,
                    endTime
                );

                console.log("Transaction gửi đi:", tx.hash);
                await tx.wait();
                console.log("Transaction thành công!");
            } catch (err) {
                console.error("Lỗi khi gửi transaction:", err);
                return res.status(500).json({ message: "Lỗi khi gửi transaction!", error: err.message });
            }
        }

        res.status(200).json({
            message: `Đợt bầu cử đã được ${chapThuan ? "duyệt" : "từ chối"} thành công!`,
            dotBauCu
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

export const layDotBauCuChuaDienRa = async (req, res) => {
    try {
        const dotBauCuList = await DotBauCu.find({
            trangThai: { $ne: "Chờ xét duyệt" }
        });

        res.status(200).json(dotBauCuList);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách đợt bầu cử chưa diễn ra!", error });
    }
};


export const xoaDotBauCu = async (req, res) => {
    try {
        const { id } = req.params;
        const idNguoiXoa = req.nguoidung._id;

        const dotBauCu = await DotBauCu.findById(id);
        if (!dotBauCu) {
            return res.status(404).json({ message: "Không tìm thấy đợt bầu cử!" });
        }

        if (dotBauCu.idNguoiTao.toString() !== idNguoiXoa.toString()) {
            return res.status(403).json({ message: "Bạn không có quyền xóa đợt bầu cử này!" });
        }

        if (dotBauCu.trangThai !== "Chờ xét duyệt" && dotBauCu.trangThai !== "Từ chối") {
            return res.status(400).json({
                message: "Chỉ có thể xóa đợt bầu cử khi đang Chờ xét duyệt hoặc Từ chối!",
            });
        }

        await DotBauCu.findByIdAndDelete(id);
        res.status(200).json({ message: "Xóa đợt bầu cử thành công!" });

    } catch (error) {
        console.error("Lỗi xoaDotBauCu controller:", error.message);
        res.status(500).json({ message: "Lỗi máy chủ!", error: error.message });
    }
};


export const capNhatTrangThaiDot = async (req, res) => {
    try {
        const { id } = req.params;
        const { trangThaiMoi, privateKey } = req.body;
        const idNguoiDuyet = req.nguoidung._id;

      
        if (!privateKey) {
            return res.status(400).json({ message: "Vui lòng nhập private key!" });
        }

     
        const nguoiDuyet = await NguoiDung.findById(idNguoiDuyet);
        if (!nguoiDuyet || nguoiDuyet.roleND !== "ADMIN") {
            return res.status(403).json({ message: "Bạn không có quyền cập nhật trạng thái!" });
        }

       
        const dotBauCu = await DotBauCu.findById(id);
        if (!dotBauCu) {
            return res.status(404).json({ message: "Không tìm thấy đợt bầu cử!" });
        }

      
        const provider = new ethers.JsonRpcProvider(process.env.INFURA_API_URL);
        let signer;
        try {
            signer = new ethers.Wallet(privateKey, provider);
        } catch (error) {
            return res.status(400).json({ message: "Private key không hợp lệ!" });
        }

        const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

     
        if (signer.address.toLowerCase() !== nguoiDuyet.address.toLowerCase()) {
            return res.status(403).json({ message: "Private key không khớp với tài khoản admin!" });
        }

   
        if (!["Đang diễn ra", "Đã kết thúc"].includes(trangThaiMoi)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
        }

      
        dotBauCu.trangThai = trangThaiMoi;
        dotBauCu.idNguoiDuyet = idNguoiDuyet;
        dotBauCu.thoiGianDuyet = new Date();
        await dotBauCu.save();

       
        let tx;
        if (trangThaiMoi === "Đang diễn ra") {
            tx = await contract.startElection(dotBauCu._id.toString());
            await UngCuVien.updateMany(
                { idDotBauCu: id }, 
                { $set: { trangThai: "Đang diễn ra" } }
            );
            await DonViBauCu.updateMany(
                { idDotBauCu: id }, 
                { $set: { trangThai: "Đang diễn ra" } }
            );
            console.log(` Đã cập nhật trạng thái ứng cử viên của đợt bầu cử ${id}`);
        } else if (trangThaiMoi === "Đã kết thúc") {
            tx = await contract.endElection(dotBauCu._id.toString());
            await UngCuVien.updateMany(
                { idDotBauCu: id }, 
                { $set: { trangThai: "Đã kết thúc" } }
            );
            await DonViBauCu.updateMany(
                { idDotBauCu: id }, 
                { $set: { trangThai: "Đã kết thúc" } }
            );
            console.log(`Đã cập nhật trạng thái ứng cử viên của đợt bầu cử ${id}`);
        }

        if (tx) await tx.wait();

        res.status(200).json({ message: "Cập nhật trạng thái thành công!" });

    } catch (error) {
        console.error("Lỗi capNhatTrangThaiDot controller:", error);
        res.status(500).json({ message: "Lỗi máy chủ!", error: error.message });
    }
};

export const layKetQuaBauCu = async (req, res) => {
    try {
        const { idDotBauCu } = req.params;
        const privateKey = process.env.ADMIN_PRIVATE_KEY;
        if (!privateKey) {
            return res.status(500).json({ message: "Lỗi hệ thống: Không tìm thấy Private Key" });
        }

        let signer;
        try {
            signer = new ethers.Wallet(privateKey, provider);
        } catch (error) {
            return res.status(400).json({ message: "Private Key không hợp lệ!" });
        }

        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const winners = await contract.getElectionWinners(idDotBauCu);
        if (!winners || winners.length === 0) {
            return res.json({ message: "Chưa có kết quả bầu cử!", winners: [] });
        }

        const danhSachUngCuVien = await UngCuVien.find({ _id: { $in: winners } });

        console.log("Thông tin người thắng:", danhSachUngCuVien);
        
        return res.json({ message: "Lấy kết quả thành công!", winners: danhSachUngCuVien });
    } catch (error) {
        console.error("Lỗi khi lấy kết quả bầu cử:", error);
        return res.status(500).json({ message: "Lỗi khi lấy kết quả bầu cử", error: error.message });
    }
};

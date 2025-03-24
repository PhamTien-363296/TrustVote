import CuTri from "../models/cutri.model.js";
import NguoiDung from "../models/nguoidung.model.js";
import sendOTP from "../lib/utils/sendOTP.js";
import { generateOtpToken, verifyOtpToken,generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import bcrypt from 'bcryptjs'

export const themCutri = async (req, res) => {
    try {
        const { hoVaTen, cccd, diaChi, diaChiChiTiet } = req.body;
        console.log(req.body)
        const idNguoiTao = req.nguoidung._id;

        const nguoiTao = await NguoiDung.findById(idNguoiTao);
        if (!nguoiTao) {
            return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        }

        if (nguoiTao.roleND !== "VOTER_MANAGER") {
            return res.status(403).json({ message: "Bạn không có quyền thêm cử tri!" });
        }

        const cccdTonTai = await CuTri.findOne({ cccd });
        if (cccdTonTai) {
            return res.status(400).json({ message: "CCCD đã tồn tại!" });
        }
        if (!diaChi || !diaChi.capTinh || !diaChi.capHuyen || !diaChi.capXa || !diaChiChiTiet){
            return res.status(400).json({ message: "Địa chỉ không hợp lệ!" });
        }
        const cutriMoi = new CuTri({
            hoVaTen,
            cccd,
            idNguoiTao,
            diaChi: {
                capTinh: {
                    id: diaChi.capTinh.id,
                    ten: diaChi.capTinh.name
                },
                capHuyen: {
                    id: diaChi.capHuyen.id,
                    ten: diaChi.capHuyen.name
                },
                capXa: {
                    id: diaChi.capXa.id,
                    ten: diaChi.capXa.name
                },
                diaChiChiTiet: diaChiChiTiet
            }
        });

        await cutriMoi.save();
        res.status(201).json({ message: "Thêm cử tri thành công!", cutri: cutriMoi });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error: error.message });
        console.log( error.message )
    }
};


export const layDanhSachCuTri = async (req, res) => {
    try {
        const danhSachCuTri = await CuTri.find()
        .populate("idNguoiTao", "username")
        .populate({
            path: "idNguoiDuyet",
            select: "username",
            match: { _id: { $ne: null } } // Chỉ populate nếu khác null
        })
        .select("-matKhau")
        .sort({ hoVaTen: 1 });

        return res.status(200).json(danhSachCuTri);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách cử tri:", error);
        return res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};

export const layCutriTheoCCCD = async (req, res) => {
    try {
        const { cccd } = req.params;

        const cutri = await CuTri.findOne({ cccd });
        if (!cutri) {
            return res.status(404).json({ message: "Tài khoản này chưa được đăng ký" });
        }

        if (cutri.matKhau) {
            return res.status(400).json({ message: "Bạn đã kích hoạt tài khoản rồi!" });
        }

        res.status(200).json(cutri);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

export const guiOTP = async (req, res) => {
    const { email } = req.body;
    //console.log("Email nhận được:", email);
    if (!email) return res.status(400).json({ error: "Email không được bỏ trống!" });

    try {
        const otp = await sendOTP(email);
        //console.log("OTP nhận được:", otp);

        const otpToken = generateOtpToken(email, otp);
        res.status(200).json({ message: "OTP đã được gửi!", otpToken });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi gửi OTP." });
    }
};

export const xacThucOTP = async (req, res) => {
    try {
        const { otpToken, otp } = req.body;

        if (!otpToken || !otp) {
            return res.status(400).json({ error: "Thiếu OTP hoặc token!" });
        }

        //console.log("OTP TOKEN", otpToken)
        const decoded = verifyOtpToken(otpToken);
        //console.log("OTP decoded TOKEN", decoded.otp)

        if (decoded.otp !== otp) {
            return res.status(400).json({ error: "OTP không chính xác!" });
        }

        res.status(200).json({ message: "Xác thực OTP thành công!" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi xác thực." });
    }
};

export const capNhatMatKhau = async (req, res) => {
    try {
        const { cccd, matKhau } = req.body;

        if (!cccd || !matKhau) {
            return res.status(400).json({ error: "Vui lòng cung cấp CCCD và mật khẩu mới" });
        }

        const cutri = await CuTri.findOne({ cccd });
        if (!cutri) {
            return res.status(404).json({ error: "Không tìm thấy cử tri với CCCD này" });
        }

        if (matKhau.length <= 6) {
            return res.status(400).json({ error: "Mật khẩu ít nhất phải có 6 ký tự" });
        }

        const salt = await bcrypt.genSalt(10);
        const matKhauHash = await bcrypt.hash(matKhau, salt);

        cutri.matKhau = matKhauHash;
        cutri.trangThai = "Hoạt động";
        await cutri.save();

        res.status(200).json({ message: "Cập nhật mật khẩu thành công!" });
    } catch (error) {
        console.error("Lỗi capNhatMatKhau controller", error.message);
        res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại sau" });
    }
};

export const danhNhap = async (req, res) => {
    try {
        const { cccd, matKhau } = req.body;
        
        const cutri = await CuTri.findOne({ cccd });
        if (!cutri) {
            return res.status(400).json({ error: "CCCD hoặc mật khẩu không đúng" });
        }

        const kiemTra_matKhau = await bcrypt.compare(matKhau, cutri.matKhau);
        if (!kiemTra_matKhau) {
            return res.status(400).json({ error: "CCCD hoặc mật khẩu không đúng" });
        }        

        generateTokenAndSetCookie(cutri._id, res);
        return res.status(200).json({ message: "Đăng nhập thành công", user: { id: cutri._id, cccd: cutri.cccd } });

    } catch (error) {
        console.log("Lỗi danhNhap controller:", error.message);
        return res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại sau" });
    }
};

export const dangXuat = async (req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({ message:"Đăng xuất thành công" })
    } catch (error) {
        console.log("Lỗi dangXuat controller",error.message)
        res.status(500).json({ error: "Lỗi 500"})
    }
}


export const getMe = async(req,res)=>{
    try{
        const cutri = await CuTri.findById(req.cutri._id).select("-matKhau")
        res.status(200).json(cutri)
    }catch(error){
        console.log("Lỗi getMe controller",error.message)
        res.status(500).json({error:"Lỗi 500"})
    }
}

export const xoaCutri = async (req, res) => {
    try {
        const { id } = req.params;
        const idNguoiXoa = req.nguoidung._id;

        const cutri = await CuTri.findById(id);
        if (!cutri) {
            return res.status(404).json({ message: "Không tìm thấy cử tri!" });
        }

        if (cutri.idNguoiTao.toString() !== idNguoiXoa.toString()) {
            return res.status(403).json({ message: "Bạn không có quyền xóa cử tri này!" });
        }

        if (cutri.trangThai !== "Chờ xét duyệt" && cutri.trangThai !== "Từ chối") {
            return res.status(400).json({ message: "Chỉ có thể xóa cử tri khi đang Chờ xét duyệt hoặc Từ chối!" });
        }

        await CuTri.findByIdAndDelete(id);
        res.status(200).json({ message: "Xóa cử tri thành công!" });

    } catch (error) {
        console.error("Lỗi xoaCutri controller:", error.message);
        res.status(500).json({ message: "Lỗi máy chủ!", error: error.message });
    }
};

export const capNhatTrangThaiCuTri = async (req, res) => {
    try {
        const { id } = req.params;
        const { trangThaiMoi } = req.body;
        const idNguoiDuyet = req.nguoidung._id;

        const nguoiDuyet = await NguoiDung.findById(idNguoiDuyet);
        if (!nguoiDuyet) {
            return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        }

        if (nguoiDuyet.roleND !== "ELECTION_VERIFIER") {
            return res.status(403).json({ message: "Bạn không có quyền cập nhật trạng thái!" });
        }

        const cuTri = await CuTri.findById(id);
        if (!cuTri) {
            return res.status(404).json({ message: "Không tìm thấy cử tri!" });
        }

        if (cuTri.trangThai !== "Chờ xét duyệt") {
            return res.status(400).json({
                message: "Chỉ có thể cập nhật khi trạng thái là 'Chờ xét duyệt'!",
            });
        }

        cuTri.trangThai = trangThaiMoi;
        cuTri.idNguoiDuyet = idNguoiDuyet;
        cuTri.thoiGianDuyet = new Date();

        await cuTri.save();

        res.status(200).json({
            message: "Cập nhật trạng thái thành công!"
        });

    } catch (error) {
        console.error("Lỗi capNhatTrangThaiCuTri controller:", error.message);
        res.status(500).json({ message: "Lỗi máy chủ!", error: error.message });
    }
};

import { ethers } from "ethers";
import abi from "../abi.js";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.INFURA_API_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = abi; 

export const themPhieuBau = async (req, res) => {
    try {
        const idCuTri = req.cutri._id;
        const { matKhau, ungCuVien, idDotBauCu, idDonViBauCu } = req.body;

        const cuTri = await CuTri.findById(idCuTri);
        if (!cuTri) {
            return res.status(404).json({ message: "Không tìm thấy cử tri!" });
        }

        const kiemTra_matKhau = await bcrypt.compare(matKhau, cuTri.matKhau);
        if (!kiemTra_matKhau) {
            return res.status(400).json({ error: "Mật khẩu không đúng" });
        }

        if (!Array.isArray(ungCuVien) || ungCuVien.length === 0) {
            return res.status(400).json({ message: "Danh sách ứng cử viên không hợp lệ!" });
        }

        const privateKey = process.env.VOTER_PRIVATE_KEY;
        if (!privateKey) {
            return res.status(500).json({ message: "Lỗi hệ thống: Không tìm thấy Private Key trong .env" });
        }
        console.log("Provider:", provider);
        console.log("privateKey:", privateKey);

        let signer;
        try {
            signer = new ethers.Wallet(privateKey, provider);
        } catch (error) {
            return res.status(400).json({ message: "Private Key không hợp lệ!" });
        }

        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            console.log("Đang gửi giao dịch duyệt sản phẩm lên Blockchain...");

            const tx = await contract.vote(idCuTri.toString(), idDotBauCu.toString(), ungCuVien);
            console.log("Giao dịch đã gửi:", tx.hash);
            await tx.wait();
            console.log("Duyệt sản phẩm thành công trên blockchain!");

            cuTri.thamGiaBauCu.push({ maDotBauCu: idDotBauCu, maDonViBauCu: idDonViBauCu });
            await cuTri.save();

            return res.json({ message: "Phiếu bầu đã được thêm!", txHash: tx.hash });
        } catch (err) {
            console.error("Lỗi khi gửi giao dịch:", err);
            return res.status(500).json({ message: "Lỗi thêm vote", error: err.message });
        }
    } catch (error) {
        console.error("Lỗi hệ thống:", error);
        return res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
};

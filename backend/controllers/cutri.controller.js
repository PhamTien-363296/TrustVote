import Cutri from "../models/cutri.model.js";
import sendOTP from "../lib/utils/sendOTP.js";
import { generateOtpToken, verifyOtpToken,generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import bcrypt from 'bcryptjs'

export const themCutri = async (req, res) => {
    try {
        const { hoVaTen, cccd, gmail, matKhau, maDinhDanh } = req.body;

        const cccdTonTai = await Cutri.findOne({ cccd });
        if (cccdTonTai) {
            return res.status(400).json({ message: "CCCD đã tồn tại!" });
        }

        const cutriMoi = new Cutri({
            hoVaTen,
            cccd,
            gmail,
            matKhau,
            maDinhDanh,
        });

        await cutriMoi.save();
        res.status(201).json({ message: "Thêm cử tri thành công!", cutri: cutriMoi });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

export const layCutriTheoCCCD = async (req, res) => {
    try {
        const { cccd } = req.params;

        const cutri = await Cutri.findOne({ cccd });
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

        const cutri = await Cutri.findOne({ cccd });
        if (!cutri) {
            return res.status(404).json({ error: "Không tìm thấy cử tri với CCCD này" });
        }

        if (matKhau.length <= 6) {
            return res.status(400).json({ error: "Mật khẩu ít nhất phải có 6 ký tự" });
        }

        const salt = await bcrypt.genSalt(10);
        const matKhauHash = await bcrypt.hash(matKhau, salt);

        cutri.matKhau = matKhauHash;
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
        
        const cutri = await Cutri.findOne({ cccd });
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
        const cutri = await Cutri.findById(req.cutri._id).select("-matKhau")
        res.status(200).json(cutri)
    }catch(error){
        console.log("Lỗi getMe controller",error.message)
        res.status(500).json({error:"Lỗi 500"})
    }
}
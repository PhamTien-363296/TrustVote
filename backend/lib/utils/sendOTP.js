import crypto from "crypto";
import transporter from "../../config/mailer.js"; // Import mailer

// Hàm tạo OTP ngẫu nhiên (6 chữ số)
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Hàm gửi OTP qua email
const sendOTP = async (email) => {
    const otp = generateOTP();

    const mailOptions = {
        from: `"Hệ thống OTP" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Mã OTP của bạn",
        text: `Mã OTP của bạn là: ${otp}. Vui lòng nhập mã này để xác thực.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP đã gửi đến ${email}: ${otp}`);
        return otp;
    } catch (error) {
        console.error("Lỗi gửi email:", error);
        throw new Error("Không thể gửi email OTP.");
    }
};

export default sendOTP;

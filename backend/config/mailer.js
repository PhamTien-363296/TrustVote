import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Email gửi OTP
        pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng Gmail
    },
});

export default transporter;

import jwt from "jsonwebtoken"

export const generateTokenAndSetCookie = (idNguoidung,res)=>{
    const token=jwt.sign({idNguoidung},process.env.JWT_SECRET,{
        expiresIn: '1d'
    })
    res.cookie("jwt",token,{
        maxAge: 15*24*60*60*1000, 
        httpOnly: true, 
        sameSite:"strict",
        secure: process.env.NODE_ENV !=="development"
    })
}

// Hàm tạo JWT chứa OTP
export const generateOtpToken = (email, otp) => {
    return jwt.sign({ email, otp }, process.env.JWT_SECRET, { expiresIn: "1m" });
};

// Hàm xác thực JWT chứa OTP
export const verifyOtpToken = (otpToken) => {
    return jwt.verify(otpToken, process.env.JWT_SECRET);
};
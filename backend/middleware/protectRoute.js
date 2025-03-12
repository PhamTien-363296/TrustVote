import Nguoidung from '../models/nguoidung.model.js'
import jwt from "jsonwebtoken"
import Cutri from '../models/cutri.model.js'

export const protectRoute = async (req,res,next)=>{
    try{
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({error:"Bạn cần đăng nhập trước"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({error:"không xác thực : token không hợp lệ"})
        }
        const nguoidung = await Nguoidung.findById(decoded.idNguoidung).select("-matKhau")
        if(!nguoidung){
            return res.status(401).json({error:"Không tìm thấy người dùng"})
        }
        req.nguoidung = nguoidung
        next()
    } catch(error){
        console.log("Lỗi protectRoute ",error.message)
        return res.status(500).json({error:" Lỗi 500" })
    }
}

export const protectRoute2 = async (req,res,next)=>{
    try{
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({error:"Bạn cần đăng nhập trước"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({error:"không xác thực : token không hợp lệ"})
        }
        const cutri = await Cutri.findById(decoded.idNguoidung).select("-matKhau")
        if(!cutri){
            return res.status(401).json({error:"Không tìm thấy cử tri"})
        }
        req.cutri = cutri
        next()
    } catch(error){
        console.log("Lỗi protectRoute ",error.message)
        return res.status(500).json({error:" Lỗi 500" })
    }
}

export const isAdmin = async (req,res,next) => {
    if (req.nguoidung && req.nguoidung.roleND == "admin") {
        next();
    } else {
        return res.status(403).json({error: "Error: Chỉ dành cho admin" })
    }
}
import Nguoidung from '../models/nguoidung.model.js' 
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import { ethers } from "ethers";
import abi from "../abi.js"

import * as dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.INFURA_API_URL);
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;


const signer = new ethers.Wallet(adminPrivateKey, provider);

const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = abi;
const contract = new ethers.Contract(contractAddress, contractABI, signer);

export const dangKy = async (req, res) => {
    try {
        const { username, email, address, matKhau, moTaND, roleND } = req.body;
        const idNguoiTao = req.nguoidung._id;

        console.log(req.body);

      
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Định dạng email không hợp lệ" });
        }

       
        if (await Nguoidung.findOne({ username })) {
            return res.status(400).json({ error: "Tên tài khoản đã được sử dụng" });
        }
        if (await Nguoidung.findOne({ email })) {
            return res.status(400).json({ error: "Email này đã được sử dụng" });
        }

     
        if (matKhau.length <= 6) {
            return res.status(400).json({ error: "Mật khẩu ít nhất phải có 6 ký tự" });
        }

       
        const nguoiTao = await Nguoidung.findById(idNguoiTao);
        if (!nguoiTao) {
            return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        }
        if (nguoiTao.roleND !== "ADMIN") {
            return res.status(403).json({ message: "Bạn không có quyền tạo người dùng!" });
        }

     
        const salt = await bcrypt.genSalt(10);
        const matKhauhash = await bcrypt.hash(matKhau, salt);

       
        const nguoiDungMoi = new Nguoidung({
            username,
            email,
            matKhau: matKhauhash,
            moTaND,
            address,
            roleND,
            idNguoiTao
        });
        await nguoiDungMoi.save();

        
        if (roleND === "ELECTION_VERIFIER") {
            try {
                const tx = await contract.addInspector(address, username);
                await tx.wait();
            } catch (error) {
                return res.status(500).json({ error: "Lỗi khi lưu vào blockchain: " + error.message });
            }
        }

        res.status(201).json({
            _id: nguoiDungMoi._id,
            username: nguoiDungMoi.username,
            email: nguoiDungMoi.email,
        });
    } catch (error) {
        console.log("Lỗi dangKy controller", error.message);
        res.status(500).json({ error: "Lỗi 500" });
    }
};

export const danhNhap = async (req,res)=>{
    try{
        const {email, matKhau } = req.body
        const nguoidung = await Nguoidung.findOne({email})
        const kiemTra_matKhau = await bcrypt.compare(matKhau, nguoidung?.matKhau || "")  
    
        if(!email || !kiemTra_matKhau){
            return res.status(400).json({ error: "Email hoặc mật khẩu không đúng" })
        }

        generateTokenAndSetCookie(nguoidung._id,res)
    
        res.status(200).json({
            email: nguoidung.email,
            username: nguoidung.username,
            roleND: nguoidung.roleND,
            _id: nguoidung._id,
            address: nguoidung.address,
            anhDaiDienND : nguoidung.anhDaiDienND
        })
    
        } catch (error) {
        console.log("Lỗi danhNhap controller",error.message)
        res.status(500).json({ error: "Lỗi 500" })
        }
    }


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
        const nguoidung = await Nguoidung.findById(req.nguoidung._id).select("-matKhau")
        res.status(200).json(nguoidung)
    }catch(error){
        console.log("Lỗi getMe controller",error.message)
        res.status(500).json({error:"Lỗi 500"})
    }
}

export const layDanhSachNguoiDung = async (req, res) => {
    try {
        const danhSachNguoiDung = await Nguoidung.find().select("-matKhau");
        res.status(200).json(danhSachNguoiDung);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", error });
    }
};

export const capNhatTrangThaiND = async (req, res) => {
    try {
        const { id } = req.params;
        const { trangThaiMoi } = req.body;
        const idNguoiDuyet = req.nguoidung._id;

        const nguoiDuyet = await Nguoidung.findById(idNguoiDuyet);
        if (!nguoiDuyet) {
            return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        }

        if (nguoiDuyet.roleND !== "ADMIN") {
            return res.status(403).json({ message: "Bạn không có quyền cập nhật trạng thái!" });
        }

        const nguoiDung = await Nguoidung.findById(id);
        if (!nguoiDung) {
            return res.status(404).json({ message: "Không tìm thấy đợt bầu cử!" });
        }
        
        nguoiDung.trangThai = trangThaiMoi;

        await nguoiDung.save();

        res.status(200).json({
            message: "Cập nhật trạng thái thành công!"
        });

    } catch (error) {
        console.error("Lỗi capNhatTrangThaiDot controller:", error.message);
        res.status(500).json({ message: "Lỗi máy chủ!", error: error.message });
    }
};
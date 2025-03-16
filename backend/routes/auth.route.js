import express from "express"
import {dangKy, danhNhap, dangXuat, getMe, layDanhSachNguoiDung, capNhatTrangThaiND, } from '../controllers/auth.controller.js'
import { protectRoute } from "../middleware/protectRoute.js"
const router = express.Router()

router.post("/signup",protectRoute,dangKy)
router.post("/login",danhNhap)
router.post("/logout",dangXuat)
router.get("/getme",protectRoute,getMe)
router.get("/lay",layDanhSachNguoiDung)
router.put("/capnhat/:id",protectRoute,capNhatTrangThaiND)

export default router
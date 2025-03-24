import express from "express";
import { capNhatMatKhau, capNhatTrangThaiCuTri, dangXuat, danhNhap, getMe, guiOTP, layCutriTheoCCCD, layDanhSachCuTri, themCutri, themPhieuBau, xacThucOTP, xoaCutri } from "../controllers/cutri.controller.js";
import { protectRoute, protectRoute2 } from "../middleware/protectRoute.js"

const router = express.Router();

router.post("/them", protectRoute, themCutri);
router.get("/lay", layDanhSachCuTri);

router.get("/layTheoCCCD/:cccd", layCutriTheoCCCD);
router.post("/guiOTP", guiOTP);
router.post("/xacthucOTP", xacThucOTP);
router.put("/capNhatMatKhau", capNhatMatKhau);

router.post("/login",danhNhap)
router.post("/logout",dangXuat)
router.get("/getme",protectRoute2,getMe)

router.delete("/xoa/:id",protectRoute,xoaCutri)
router.put("/capnhat/:id",protectRoute,capNhatTrangThaiCuTri)

router.post("/themphieubau",protectRoute2,themPhieuBau)

export default router;

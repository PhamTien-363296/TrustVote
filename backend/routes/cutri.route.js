import express from "express";
import { capNhatMatKhau, dangXuat, danhNhap, getMe, guiOTP, layCutriTheoCCCD, themCutri, xacThucOTP } from "../controllers/cutri.controller.js";
import { protectRoute2 } from "../middleware/protectRoute.js"

const router = express.Router();

router.post("/them", themCutri);
router.get("/layTheoCCCD/:cccd", layCutriTheoCCCD);
router.post("/guiOTP", guiOTP);
router.post("/xacthucOTP", xacThucOTP);
router.put("/capNhatMatKhau", capNhatMatKhau);

router.post("/login",danhNhap)
router.post("/logout",dangXuat)
router.get("/getme",protectRoute2,getMe)

export default router;

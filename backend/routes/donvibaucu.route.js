import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { capNhatTrangThaiDonVi, layDanhSachDonViBauCu, themDonViBauCu, xoaDonViBauCu } from "../controllers/donvibaucu.controller.js"
const router = express.Router()

router.post("/them", protectRoute, themDonViBauCu)
router.get("/lay", layDanhSachDonViBauCu)
router.delete("/xoa/:id",protectRoute,xoaDonViBauCu)
router.put("/capnhat/:id",protectRoute,capNhatTrangThaiDonVi)

export default router
import express from "express"
import { protectRoute, protectRoute2 } from "../middleware/protectRoute.js"
import { capNhatTrangThaiDonVi, layDanhSachDonViBauCu, layDanhSachDonViBauCuCDR, layDanhSachDonViBauCuDDR, layDanhSachDonViBauCuTheoDot, layKetQuaBauCu, themDonViBauCu, xoaDonViBauCu } from "../controllers/donvibaucu.controller.js"
const router = express.Router()

router.post("/them", protectRoute, themDonViBauCu)
router.get("/lay", layDanhSachDonViBauCu)
router.get("/lay/:idDotBauCu", layDanhSachDonViBauCuTheoDot)
router.get("/lay/dv/chuadienra", layDanhSachDonViBauCuCDR)
router.get("/lay/dv/dangdienra", layDanhSachDonViBauCuDDR)

router.delete("/xoa/:id",protectRoute,xoaDonViBauCu)
router.put("/capnhat/:id",protectRoute,capNhatTrangThaiDonVi)
router.get("/layKetQua",protectRoute2,layKetQuaBauCu)

export default router
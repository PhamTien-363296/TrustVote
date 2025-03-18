import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { capNhatTrangThaiUCV, duyetUngCuVien, layDanhSachUngCuVien, layUngCuVienTheoId, themUngCuVien, xoaUngCuVien } from "../controllers/ungcuvien.controller.js"
const router = express.Router()

router.post("/them", protectRoute, themUngCuVien)
router.post("/duyet", protectRoute, duyetUngCuVien)
router.get("/lay", layDanhSachUngCuVien);
router.delete("/xoa/:id",protectRoute,xoaUngCuVien)
router.get("/lay/:id", layUngCuVienTheoId)
router.put("/capnhat/:id",protectRoute,capNhatTrangThaiUCV)

export default router
import express from "express"
import { protectRoute, protectRoute2 } from "../middleware/protectRoute.js"
import { capNhatTrangThaiUCV, duyetUngCuVien, getUngCuVienByCuTri, layDanhSachUngCuVien, layDanhSachUngCuVienTheoDot, layUngCuVienTheoId, themUngCuVien, xoaUngCuVien } from "../controllers/ungcuvien.controller.js"
const router = express.Router()

router.post("/them", protectRoute, themUngCuVien)
router.post("/duyet", protectRoute, duyetUngCuVien)
router.get("/lay", layDanhSachUngCuVien);

router.delete("/xoa/:id",protectRoute,xoaUngCuVien)
router.get("/lay/:id", layUngCuVienTheoId)
router.put("/capnhat/:id",protectRoute,capNhatTrangThaiUCV)


router.get("/lay-theocutri",protectRoute2,getUngCuVienByCuTri)
router.get("/laytheodot/:idDotBauCu", layDanhSachUngCuVienTheoDot);

export default router
import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { capNhatTrangThaiDot, layDotBauCu, layDotBauCuChuaDienRa, layKetQuaBauCu, themDotBauCu, xetDuyetDotBauCu, xoaDotBauCu } from "../controllers/dotbaucu.controller.js"
const router = express.Router()

router.post("/them", protectRoute, themDotBauCu)
router.post("/xetduyet/:id",protectRoute, xetDuyetDotBauCu);
router.get("/lay", layDotBauCu);
router.get("/lay/daduyet", layDotBauCuChuaDienRa)
router.delete("/xoa/:id",protectRoute,xoaDotBauCu)
router.put("/capnhat/:id",protectRoute,capNhatTrangThaiDot)
router.get("/layketqua/:idDotBauCu",layKetQuaBauCu)

export default router
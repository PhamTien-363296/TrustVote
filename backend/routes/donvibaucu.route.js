import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { layDanhSachDonViBauCu, themDonViBauCu } from "../controllers/donvibaucu.controller.js"
const router = express.Router()

router.post("/them", protectRoute, themDonViBauCu)
router.get("/lay", layDanhSachDonViBauCu)

export default router
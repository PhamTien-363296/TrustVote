import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { layDotBauCu, layDotBauCuChuaDienRa, themDotBauCu } from "../controllers/dotbaucu.controller.js"
const router = express.Router()

router.post("/them", protectRoute, themDotBauCu)
router.get("/lay", layDotBauCu);
router.get("/lay/daduyet", layDotBauCuChuaDienRa)

export default router
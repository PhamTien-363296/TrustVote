import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { layDotBauCu, themDotBauCu } from "../controllers/dotbaucu.controller.js"
const router = express.Router()

router.post("/them", protectRoute, themDotBauCu)
router.get("/lay", layDotBauCu);

export default router
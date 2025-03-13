import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { themDonViBauCu } from "../controllers/donvibaucu.controller.js"
const router = express.Router()

router.post("/them", protectRoute, themDonViBauCu)

export default router
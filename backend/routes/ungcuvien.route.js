import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { themUngCuVien } from "../controllers/ungcuvien.controller.js"
const router = express.Router()

router.post("/them", protectRoute, themUngCuVien)
router.get("/lay", layDotBauCu);

export default router
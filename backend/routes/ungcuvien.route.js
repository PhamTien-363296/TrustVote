import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { duyetUngCuVien, themUngCuVien } from "../controllers/ungcuvien.controller.js"
const router = express.Router()

router.post("/them", protectRoute, themUngCuVien)
router.post("/duyet", protectRoute, duyetUngCuVien);

export default router
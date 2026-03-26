import express from "express";
import {
  getAttendance,
  addAttendance,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getAttendance);
router.post("/", protect, authorizeRoles("admin", "hr"), addAttendance);

export default router;

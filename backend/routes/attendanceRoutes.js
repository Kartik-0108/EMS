import express from "express";
import {
  getAttendance,
  addAttendance,
} from "../controllers/attendanceController.js";



const router = express.Router();

router.get("/",  getAttendance);
router.post("/", addAttendance);

export default router;
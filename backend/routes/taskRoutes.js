import express from "express";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// GET tasks (with optional filter)
router.get("/", getTasks);

// ADD task
router.post("/", addTask);

// UPDATE task status
router.put("/:id", updateTask);

// DELETE task
router.delete("/:id", deleteTask);

export default router;
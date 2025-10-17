import express from "express";
import { getTasksByProject, createTask, updateTask, deleteTask } from "../controllers/taskController.js";

const router = express.Router();

router.route("/projects/:projectId").get(getTasksByProject).post(createTask);
router.route("/:id").put(updateTask).delete(deleteTask);

export default router;

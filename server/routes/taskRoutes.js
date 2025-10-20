import express from "express";
import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  updateTasksOrder, // <-- Import the new controller
} from "../controllers/taskController.js";

const router = express.Router();

// Existing routes
router.route("/projects/:projectId/tasks").get(getTasksByProject).post(createTask);

// NEW ROUTE for batch updating task order and status
router.route("/tasks/update-order").put(updateTasksOrder);

// Existing routes
router.route("/tasks/:id").put(updateTask).delete(deleteTask);

export default router;

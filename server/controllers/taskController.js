import * as taskService from "../services/taskService.js";
import { catchAsync } from "../middleware/errorMiddleware.js";

export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const tasks = await Task.find({ projectId }).sort({ order: 1, createdAt: 1 }).lean();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;
  const newTask = await taskService.createNewTask(projectId, req.body);
  res.status(201).json(newTask);
});

export const updateTask = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedTask = await taskService.updateTaskDetails(id, req.body);
  res.status(200).json(updatedTask);
});

export const deleteTask = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await taskService.deleteTaskById(id);
  res.status(200).json({ message: "Task deleted" });
});

export const updateTasksOrder = catchAsync(async (req, res, next) => {
  const { tasks } = req.body;
  await taskService.bulkUpdateTasksOrder(tasks);
  res.status(200).json({ message: "Tasks updated successfully" });
});
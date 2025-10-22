import Task from "../models/taskModel.js";
import Project from "../models/projectModel.js";
import { AppError } from "../middleware/errorMiddleware.js";

/**
 * @desc Create a new task for a project.
 * @param {string} projectId - The project ID.
 * @param {object} taskData - Data for the new task.
 * @returns {Promise<Object>} The newly created task.
 */
export const createNewTask = async (projectId, taskData) => {
  const { title, description, status } = taskData;
  if (!title) {
    throw new AppError("Task title is required", 400);
  }
  if (!(await Project.findById(projectId))) {
    throw new AppError("Project not found", 404);
  }

  const taskStatus = status || "To Do";
  const highestOrderTask = await Task.findOne({ projectId, status: taskStatus }).sort({ order: -1 });
  const newOrder = highestOrderTask ? highestOrderTask.order + 1 : 0;

  const task = new Task({
    projectId,
    title,
    description: description || "",
    status: taskStatus,
    order: newOrder,
  });
  await task.save();
  return task;
};

/**
 * @desc Update an existing task.
 * @param {string} id - The task ID.
 * @param {object} updates - Data for updating the task.
 * @returns {Promise<Object>} The updated task.
 */
export const updateTaskDetails = async (id, updates) => {
  const task = await Task.findById(id);
  if (!task) {
    throw new AppError("Task not found", 404);
  }
  if (updates.hasOwnProperty('order')) {
    delete updates.order;
  }
  Object.assign(task, updates);
  await task.save();
  return task;
};

/**
 * @desc Delete a task by its ID.
 * @param {string} id - The task ID.
 */
export const deleteTaskById = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    throw new AppError("Task not found", 404);
  }
};

/**
 * @desc Update the order and status of multiple tasks in bulk.
 * @param {Array} tasks - An array of task objects with _id, order, and status.
 */
export const bulkUpdateTasksOrder = async (tasks) => {
  if (!tasks || !Array.isArray(tasks)) {
    throw new AppError("Invalid request body: 'tasks' array is required.", 400);
  }
  if (tasks.length === 0) {
    return;
  }
  const bulkOps = tasks.map(task => ({
    updateOne: {
      filter: { _id: task._id },
      update: { $set: { order: task.order, status: task.status } },
    },
  }));
  await Task.bulkWrite(bulkOps);
};
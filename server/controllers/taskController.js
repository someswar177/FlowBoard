import Task from "../models/taskModel.js";
import Project from "../models/projectModel.js";

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

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!title) return res.status(400).json({ message: "Task title is required" });

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
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (updates.hasOwnProperty('order')) {
      delete updates.order;
    }

    Object.assign(task, updates);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTasksOrder = async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ message: "Invalid request body: 'tasks' array is required." });
    }

    const bulkOps = tasks.map(task => ({
      updateOne: {
        filter: { _id: task._id },
        update: { $set: { order: task.order, status: task.status } },
      },
    }));

    await Task.bulkWrite(bulkOps);

    res.status(200).json({ message: "Tasks updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
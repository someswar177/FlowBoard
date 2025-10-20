import Task from "../models/taskModel.js";
import Project from "../models/projectModel.js";

// GET /api/projects/:projectId/tasks
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // This sort is correct and will now work perfectly with the persisted order
    const tasks = await Task.find({ projectId }).sort({ order: 1, createdAt: 1 }).lean();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/projects/:projectId/tasks (MODIFIED)
export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!title) return res.status(400).json({ message: "Task title is required" });

    // Logic to add the new task to the end of the column
    const taskStatus = status || "To Do";
    const highestOrderTask = await Task.findOne({ projectId, status: taskStatus }).sort({ order: -1 });
    const newOrder = highestOrderTask ? highestOrderTask.order + 1 : 0;

    const task = new Task({
      projectId,
      title,
      description: description || "",
      status: taskStatus,
      order: newOrder, // Set the calculated order
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Prevent order from being updated through this endpoint
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

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    // Note: The original code used .remove(), which is deprecated. Using findByIdAndDelete.
    res.status(500).json({ message: error.message });
  }
};

// NEW FUNCTION: PUT /api/tasks/update-order
export const updateTasksOrder = async (req, res) => {
  try {
    const { tasks } = req.body; // Expects an array of tasks to update

    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ message: "Invalid request body: 'tasks' array is required." });
    }

    // Create an array of bulk write operations for efficiency
    const bulkOps = tasks.map(task => ({
      updateOne: {
        filter: { _id: task._id },
        // Update the order and status for each task
        update: { $set: { order: task.order, status: task.status } },
      },
    }));

    // Execute all update operations in a single database command
    await Task.bulkWrite(bulkOps);

    res.status(200).json({ message: "Tasks updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
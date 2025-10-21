import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";

export const getProjects = async (req, res) => {
  try {
    const { populateTaskCount } = req.query;
    const projects = await Project.find().sort({ createdAt: -1 }).lean();

    if (populateTaskCount === "true") {
      const counts = await Task.aggregate([
        { $group: { _id: "$projectId", taskCount: { $sum: 1 } } }
      ]);
      const countMap = counts.reduce((acc, cur) => {
        acc[cur._id.toString()] = cur.taskCount;
        return acc;
      }, {});
      const projectsWithCounts = projects.map(project => ({
        ...project,
        taskCount: countMap[project._id.toString()] || 0
      }));
      return res.json(projectsWithCounts);
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }
    const project = new Project({ name, description });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).lean();
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (req.query.populateTasks === "true") {
      const tasks = await Task.find({ projectId: id }).sort({ order: 1, createdAt: 1 }).lean();
      return res.json({ ...project, tasks });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, oldName, newName } = req.body;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (name) project.name = name;
    if (description !== undefined) project.description = description;

    if (oldName && newName) {
      const trimmedNewName = newName.trim();
      if (!trimmedNewName) {
        return res.status(400).json({ message: "New column name cannot be empty." });
      }
      if (project.columnOrder.includes(trimmedNewName)) {
        return res.status(400).json({ message: "A column with this name already exists." });
      }

      const columnIndex = project.columnOrder.indexOf(oldName);
      if (columnIndex > -1) {
        project.columnOrder[columnIndex] = trimmedNewName;
        project.markModified('columnOrder'); 
      } else {
        return res.status(404).json({ message: `Column '${oldName}' not found.` });
      }

      await Task.updateMany(
        { projectId: id, status: oldName },
        { $set: { status: trimmedNewName } }
      );
    }

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await Task.deleteMany({ projectId: id });
    await Project.findByIdAndDelete(id);

    res.json({ message: "Project and related tasks deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: error.message });
  }
};

export const addColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const { columnName } = req.body;

    if (!columnName || columnName.trim().length === 0) {
      return res.status(400).json({ message: "Column name is required" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.columnOrder.includes(columnName.trim())) {
      return res.status(400).json({ message: "Column name already exists" });
    }

    project.columnOrder.push(columnName.trim());
    await project.save();
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteColumn = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { columnName } = req.body;

    const defaultColumns = ["To Do", "In Progress", "Done"];
    if (defaultColumns.includes(columnName)) {
      return res.status(400).json({ message: "Cannot delete a default column." });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    await Task.deleteMany({ projectId: projectId, status: columnName });

    const newColumnOrder = project.columnOrder.filter(col => col !== columnName);
    project.columnOrder = newColumnOrder;
    project.markModified('columnOrder');
    await project.save();

    res.status(200).json({ message: "Column and associated tasks deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
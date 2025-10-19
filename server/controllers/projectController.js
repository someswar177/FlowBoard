import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";

// GET /api/projects
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

// POST /api/projects
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

// GET /api/projects/:id
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

// PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (name) project.name = name;
    if (description !== undefined) project.description = description;

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Delete related tasks
    await Task.deleteMany({ projectId: id });

    // Delete the project itself
    await Project.findByIdAndDelete(id);

    res.json({ message: "Project and related tasks deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: error.message });
  }
};

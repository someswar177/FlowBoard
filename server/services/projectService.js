import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import { AppError } from "../middleware/errorMiddleware.js";

/**
 * @desc Get all projects, optionally with task counts.
 * @param {boolean} populateTaskCount - Flag to include task count for each project.
 * @returns {Promise<Array>} A list of projects.
 */
export const getAllProjects = async (populateTaskCount) => {
  const projects = await Project.find().sort({ createdAt: -1 }).lean();

  if (populateTaskCount) {
    const counts = await Task.aggregate([
      { $group: { _id: "$projectId", taskCount: { $sum: 1 } } },
    ]);
    const countMap = counts.reduce((acc, cur) => {
      acc[cur._id.toString()] = cur.taskCount;
      return acc;
    }, {});
    return projects.map(project => ({
      ...project,
      taskCount: countMap[project._id.toString()] || 0,
    }));
  }

  return projects;
};

/**
 * @desc Get a single project by its ID, optionally populating tasks.
 * @param {string} id - The project ID.
 * @param {boolean} populateTasks - Flag to include tasks.
 * @returns {Promise<Object>} The project object.
 */
export const getProjectDetails = async (id, populateTasks) => {
  const project = await Project.findById(id).lean();
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (populateTasks) {
    const tasks = await Task.find({ projectId: id }).sort({ order: 1, createdAt: 1 }).lean();
    return { ...project, tasks };
  }

  return project;
};

/**
 * @desc Create a new project.
 * @param {string} name - Project name.
 * @param {string} description - Project description.
 * @returns {Promise<Object>} The newly created project.
 */
export const createNewProject = async (name, description) => {
  if (!name) {
    throw new AppError("Project name is required", 400);
  }
  const project = new Project({ name, description });
  await project.save();
  return project;
};

/**
 * @desc Update an existing project's details or column names.
 * @param {string} id - The project ID.
 * @param {object} updateData - Data for updating the project.
 * @returns {Promise<Object>} The updated project.
 */
export const updateProjectDetails = async (id, updateData) => {
  const { name, description, oldName, newName } = updateData;
  const project = await Project.findById(id);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (name) project.name = name;
  if (description !== undefined) project.description = description;

  if (oldName && newName) {
    await renameProjectColumn(project, oldName, newName, id);
  }

  await project.save();
  return project;
};

/**
 * @desc Helper function to rename a column within a project.
 */
const renameProjectColumn = async (project, oldName, newName, projectId) => {
  const trimmedNewName = newName.trim();
  if (!trimmedNewName) {
    throw new AppError("New column name cannot be empty.", 400);
  }
  if (project.columnOrder.includes(trimmedNewName)) {
    throw new AppError("A column with this name already exists.", 400);
  }

  const columnIndex = project.columnOrder.indexOf(oldName);
  if (columnIndex === -1) {
    throw new AppError(`Column '${oldName}' not found.`, 404);
  }

  project.columnOrder[columnIndex] = trimmedNewName;
  project.markModified('columnOrder');

  await Task.updateMany({ projectId, status: oldName }, { $set: { status: trimmedNewName } });
};

/**
 * @desc Delete a project and all its associated tasks.
 * @param {string} id - The project ID.
 */
export const deleteProjectAndTasks = async (id) => {
  const project = await Project.findById(id);
  if (!project) {
    throw new AppError("Project not found", 404);
  }
  await Task.deleteMany({ projectId: id });
  await Project.findByIdAndDelete(id);
};

/**
 * @desc Add a new column to a project.
 * @param {string} projectId - The project ID.
 * @param {string} columnName - The name of the new column.
 * @returns {Promise<Object>} The updated project.
 */
export const addNewColumn = async (projectId, columnName) => {
  const trimmedColumnName = columnName?.trim();
  if (!trimmedColumnName) {
    throw new AppError("Column name is required", 400);
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("Project not found", 404);
  }
  if (project.columnOrder.includes(trimmedColumnName)) {
    throw new AppError("Column name already exists", 400);
  }

  project.columnOrder.push(trimmedColumnName);
  await project.save();
  return project;
};

/**
 * @desc Delete a column and its tasks from a project.
 * @param {string} projectId - The project ID.
 * @param {string} columnName - The name of the column to delete.
 */
export const deleteProjectColumn = async (projectId, columnName) => {
  const defaultColumns = ["To Do", "In Progress", "Done"];
  if (defaultColumns.includes(columnName)) {
    throw new AppError("Cannot delete a default column.", 400);
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("Project not found.", 404);
  }

  await Task.deleteMany({ projectId, status: columnName });

  project.columnOrder = project.columnOrder.filter(col => col !== columnName);
  project.markModified('columnOrder');
  await project.save();
};
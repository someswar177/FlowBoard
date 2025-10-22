import { catchAsync, AppError } from "../middleware/errorMiddleware.js";
import * as projectService from "../services/projectService.js";

export const getProjects = catchAsync(async (req, res, next) => {
  const populateTaskCount = req.query.populateTaskCount === "true";
  const projects = await projectService.getAllProjects(populateTaskCount);
  res.status(200).json(projects);
});

export const createProject = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  const newProject = await projectService.createNewProject(name, description);
  res.status(201).json(newProject);
});

export const getProjectById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const populateTasks = req.query.populateTasks === "true";
  const project = await projectService.getProjectDetails(id, populateTasks);
  res.status(200).json(project);
});

export const updateProject = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedProject = await projectService.updateProjectDetails(id, req.body);
  res.status(200).json(updatedProject);
});

export const deleteProject = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await projectService.deleteProjectAndTasks(id);
  res.status(200).json({ message: "Project and related tasks deleted" });
});

export const addColumn = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { columnName } = req.body;
  const updatedProject = await projectService.addNewColumn(id, columnName);
  res.status(200).json(updatedProject);
});

export const deleteColumn = catchAsync(async (req, res, next) => {
  const { id: projectId } = req.params;
  const { columnName } = req.body;
  
  if (!columnName) {
      return next(new AppError("Column name not provided in request body.", 400));
  }

  await projectService.deleteProjectColumn(projectId, columnName);
  res.status(200).json({ message: "Column and associated tasks deleted successfully." });
});
import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import { generateText } from "../utils/geminiClient.js";
import { getSummaryPrompt, getAskPrompt } from "../utils/promptTemplate.js";
import { catchAsync, AppError } from "../middleware/errorMiddleware.js";

export const summarizeProject = catchAsync(async (req, res, next) => {
  const { projectId, columnName } = req.body;
  if (!projectId || !columnName) {
    return next(new AppError("projectId and columnName are required", 400));
  }

  const project = await Project.findById(projectId).lean();
  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  const allTasks = await Task.find({ projectId }).lean();
  const prompt = getSummaryPrompt(project, columnName, allTasks);
  const summary = await generateText(prompt);
  
  res.status(200).json({ summary: summary?.trim() || "No summary generated." });
});

export const askAI = catchAsync(async (req, res, next) => {
  const { projectId, question } = req.body;
  if (!projectId || !question) {
    return next(new AppError("projectId and question required", 400));
  }

  const project = await Project.findById(projectId).lean();
  if (!project) {
    return next(new AppError("Project not found", 404));
  }
  
  const tasks = await Task.find({ projectId }).sort({ status: 1, order: 1 }).lean();
  const prompt = getAskPrompt(project, tasks, question);
  const answer = await generateText(prompt);

  res.status(200).json({ answer: answer?.trim() || "I'm sorry, I couldn't generate a response." });
});
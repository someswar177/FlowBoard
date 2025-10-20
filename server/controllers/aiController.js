import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import { generateText } from "../utils/geminiClient.js";

export const summarizeProject = async (req, res) => {
  try {
    const { projectId, columnName } = req.body;
    if (!projectId || !columnName) {
      return res.status(400).json({ message: "projectId and columnName are required" });
    }

    const project = await Project.findById(projectId).lean();
    if (!project) return res.status(404).json({ message: "Project not found" });

    const allTasks = await Task.find({ projectId }).lean();
    const completed = allTasks.filter(t => t.status === "Done").length;
    const total = allTasks.length || 1;
    const progress = ((completed / total) * 100).toFixed(0);

    const columnTasks = allTasks
      .filter(t => t.status === columnName)
      .map(t => `• ${t.title}${t.description ? ` — ${t.description}` : ""}`)
      .join("\n");

    const prompt = `
You are "Flow", an expert project management AI assistant. Your tone is professional, insightful, and encouraging.
Generate a two-part analysis based on the data below.

### Overall Project Context
- **Project Name:** ${project.name}
- **Overall Progress:** ${progress}% complete (${completed} of ${total} tasks are 'Done').

### Column-Specific Context
- **Column to Analyze:** "${columnName}"
- **Tasks in this Column:**
${columnTasks || "_No tasks in this column._"}

---
**Your Mandate:**

1.  **Overall Project Snapshot (1 sentence):**
    * Start with a single, concise sentence summarizing the entire project's health and progress percentage.

2.  **Detailed Column Analysis (2-3 sentences + bullet points):**
    * Immediately after the first sentence, create a new paragraph focusing ONLY on the **"${columnName}"** column.
    * Identify key themes or patterns among the tasks in this column.
    * Point out any high-priority items or potential blockers you observe.
    * Suggest 1-2 clear, actionable next steps specifically for the tasks *in this column*.

**Final Output Style:** Use Markdown for formatting. Be concise and directly helpful.
`;

    const summary = await generateText(prompt);
    res.json({ summary: summary?.trim() || "No summary generated." });
  } catch (err) {
    console.error("Summarization error:", err);
    res.status(500).json({ error: "AI summarization failed" });
  }
};

export const askAI = async (req, res) => {
  try {
    const { projectId, question } = req.body;
    if (!projectId || !question) {
      return res.status(400).json({ message: "projectId and question required" });
    }

    const project = await Project.findById(projectId).lean();
    if (!project) return res.status(404).json({ message: "Project not found" });

    const tasks = await Task.find({ projectId }).sort({ status: 1, order: 1 }).lean();
    const taskSummary = tasks
      .map(t => `• Task: "${t.title}" [Status: ${t.status}] - Description: ${t.description || "None"}`)
      .join("\n");

    const prompt = `
You are "Flow", an expert project management AI partner. Your persona is proactive, intelligent, and helpful. You are a strategic assistant designed to help users move their projects forward effectively.

### Project Context
- **Name:** ${project.name}
- **Description:** ${project.description || "No description provided."}

### Full Task List
${taskSummary || "This project has no tasks yet."}
---
**User's Question:** "${question}"
---
**Your Core Instructions:**
1.  **Analyze Intent:** First, understand the user's goal. Are they asking for information, brainstorming ideas, or looking for next steps?
2.  **Handle Two Scenarios:**
    * **If the project has NO tasks:** Your primary goal is to help the user get started. If they ask a question like "what are the next steps?" or "suggest some tasks", you MUST brainstorm a list of 3-5 initial tasks based on the project's **name and description**. Frame them as helpful suggestions.
    * **If the project HAS tasks:** Base your answer on the provided task list. Analyze the tasks to answer the user's question.
3.  **Be a True Assistant:** Do not simply state "I don't have that information." Instead, leverage your expertise as a project manager.
4.  **Formatting:** Use Markdown (especially bullet points) to make your responses clear and organized.
`;

    const answer = await generateText(prompt);
    res.json({ answer: answer?.trim() || "I'm sorry, I couldn't generate a response. Please try again." });
  } catch (err) {
    console.error("Ask AI error:", err);
    res.status(500).json({ error: "AI Q&A failed" });
  }
};


// import Project from "../models/projectModel.js";
// import Task from "../models/taskModel.js";
// import { generateText } from "../utils/geminiClient.js";

// export const summarizeProject = async (req, res) => {
//   try {
//     const { projectId } = req.body;
//     if (!projectId) return res.status(400).json({ message: "projectId is required" });

//     const project = await Project.findById(projectId).lean();
//     if (!project) return res.status(404).json({ message: "Project not found" });

//     const tasks = await Task.find({ projectId }).sort({ status: 1, order: 1 }).lean();
//     const groupedTasks = (project.columnOrder || ["To Do", "In Progress", "Done"]).reduce((acc, col) => {
//       acc[col] = tasks
//         .filter(t => t.status === col)
//         .map(t => `• ${t.title}${t.description ? ` — ${t.description}` : ""}`)
//         .join("\n");
//       return acc;
//     }, {});

//     const completed = tasks.filter(t => t.status === "Done").length;
//     const total = tasks.length || 1;
//     const progress = ((completed / total) * 100).toFixed(0);

//     const prompt = `
// You are "Flow", an expert project management AI assistant. Your tone is professional, insightful, and encouraging.
// Perform a "Project Health Check" on the following data and generate a summary.

// ### Project Details
// - **Name:** ${project.name}
// - **Description:** ${project.description || "Not provided."}
// - **Overall Progress:** ${progress}% complete.

// ### Task Distribution by Status
// ${Object.entries(groupedTasks)
//   .map(([status, list]) => `**${status}**:\n${list || "_No tasks in this column._"}\n`)
//   .join("\n")}
// ---
// **Your Mandate:**
// 1.  **Project Overview (2-3 sentences):** Summarize the project's current state, mentioning progress and task distribution.
// 2.  **Observations & Potential Risks (1-2 sentences, if any):** Politely identify potential issues (e.g., bottlenecks in 'In Progress', tasks without descriptions).
// 3.  **Actionable Next Steps (2-3 bullet points):** Suggest clear, specific actions to move the project forward.
// **Final Output Style:** Use Markdown for formatting. Be concise, professional, and directly helpful.`;

//     const summary = await generateText(prompt);
//     res.json({ summary: summary?.trim() || "No summary generated." });
//   } catch (err) {
//     console.error("Summarization error:", err);
//     res.status(500).json({ error: "AI summarization failed" });
//   }
// };

// export const askAI = async (req, res) => {
//   try {
//     const { projectId, question } = req.body;
//     if (!projectId || !question) {
//       return res.status(400).json({ message: "projectId and question required" });
//     }

//     const project = await Project.findById(projectId).lean();
//     if (!project) return res.status(404).json({ message: "Project not found" });

//     const tasks = await Task.find({ projectId }).sort({ status: 1, order: 1 }).lean();
//     const taskSummary = tasks
//       .map(t => `• Task: "${t.title}" [Status: ${t.status}] - Description: ${t.description || "None"}`)
//       .join("\n");

//     const prompt = `
// You are "Flow", an expert project management AI partner. Your persona is proactive, intelligent, and helpful. You are a strategic assistant designed to help users move their projects forward effectively.

// ### Project Context
// - **Name:** ${project.name}
// - **Description:** ${project.description || "No description provided."}

// ### Full Task List
// ${taskSummary || "This project has no tasks yet."}

// ---
// **User's Question:** "${question}"
// ---

// **Your Core Instructions:**

// 1.  **Analyze Intent:** First, understand the user's goal. Are they asking for information, brainstorming ideas, or looking for next steps?

// 2.  **Handle Two Scenarios:**
//     * **If the project has NO tasks:** Your primary goal is to help the user get started. If they ask a question like "what are the next steps?", "suggest some tasks", or "how should I start?", you MUST brainstorm a list of 3-5 initial tasks based on the project's **name and description**. Frame them as helpful suggestions to build momentum. For example: "This project is currently a blank slate! Based on the title '${project.name}', here are a few initial tasks to get you started:..."
//     * **If the project HAS tasks:** Base your answer on the provided task list. Analyze the tasks to answer the user's question. You can summarize progress, identify potential blockers, list tasks by status, or suggest which task to prioritize next.

// 3.  **Be a True Assistant:** Do not simply state "I don't have that information." Instead, leverage your expertise as a project manager. If the context is sparse, use the project title and description to make logical inferences and helpful suggestions.

// 4.  **Formatting:** Use Markdown (especially bullet points) to make your responses clear, organized, and easy to read.
// `;

//     const answer = await generateText(prompt);
//     res.json({ answer: answer?.trim() || "I'm sorry, I couldn't generate a response. Please try again." });
//   } catch (err) {
//     console.error("Ask AI error:", err);
//     res.status(500).json({ error: "AI Q&A failed" });
//   }
// };
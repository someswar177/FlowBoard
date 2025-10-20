import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import { generateText } from "../utils/geminiClient.js";

/**
 * POST /api/ai/summarize
 * Body: { projectId }
 */
export const summarizeProject = async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) return res.status(400).json({ message: "projectId is required" });

    const project = await Project.findById(projectId).lean();
    if (!project) return res.status(404).json({ message: "Project not found" });

    const tasks = await Task.find({ projectId }).sort({ status: 1, order: 1 }).lean();

    // Group tasks by status for a clear overview
    const groupedTasks = project.columnOrder.reduce((acc, col) => {
      acc[col] = tasks
        .filter(t => t.status === col)
        .map(t => `• ${t.title}${t.description ? ` — ${t.description}` : " (No description)"}`)
        .join("\n");
      return acc;
    }, {});

    const completed = tasks.filter(t => t.status === "Done").length;
    const total = tasks.length || 1; // Avoid division by zero
    const progress = ((completed / total) * 100).toFixed(0);

    // --- NEW ENHANCED PROMPT ---
    const prompt = `
You are "Flow", an expert project management AI assistant. Your tone is professional, insightful, and encouraging.

**Perform a "Project Health Check" on the following data and generate a summary.**

### Project Details
- **Name:** ${project.name}
- **Description:** ${project.description || "Not provided. A good description helps align the team."}
- **Creation Date:** ${new Date(project.createdAt).toLocaleDateString()}
- **Overall Progress:** ${progress}% complete (${completed} of ${total} tasks are 'Done').

### Task Distribution by Status
${Object.entries(groupedTasks)
  .map(([status, list]) => `**${status}**:\n${list || "_No tasks in this column._"}\n`)
  .join("\n")}

---
**Your Mandate:**

1.  **Project Overview (2-3 sentences):**
    * Start with a clear, concise summary of the project's current state.
    * Mention the progress percentage and what it implies (e.g., "just beginning," "well underway," "nearing completion").
    * Comment on the task distribution. Is there a bottleneck in 'In Progress'? Are there a lot of tasks still in 'To Do'?

2.  **Observations & Potential Risks (1-2 sentences, if any):**
    * Politely identify any potential issues. Examples:
        * Are there many tasks without descriptions? ("*To improve clarity, consider adding descriptions to all tasks.*")
        * Are there any unusual or non-standard column names? ("*Standardizing column names like 'To Do', 'In Progress', and 'Done' can enhance workflow clarity.*")
        * Is the 'In Progress' column overloaded? ("*There are several tasks in progress, which might indicate a risk of divided focus. Prioritizing them could accelerate progress.*")
    * If there are no risks, you can skip this section or give a positive observation.

3.  **Actionable Next Steps (2-3 bullet points):**
    * Based on your analysis, suggest clear, specific actions.
    * Focus on what will move the project forward most effectively.
    * Example: "Prioritize tasks in the 'To Do' column to build momentum." or "Review the tasks in 'In Progress' to identify any blockers."

**Final Output Style:**
* Use Markdown for formatting (headings, bolding, bullet points).
* Be concise, professional, and directly helpful. Do not sound like a generic chatbot.
`;

    const summary = await generateText(prompt);
    res.json({ summary: summary?.trim() || "No summary generated." });
  } catch (err) {
    console.error("Summarization error:", err);
    res.status(500).json({ error: "AI summarization failed" });
  }
};

/**
 * POST /api/ai/ask
 * Body: { projectId, question }
 */
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

    // --- NEW ENHANCED PROMPT ---
    const prompt = `
You are "Flow", an expert project management AI assistant. Your persona is helpful, professional, and precise. You must answer the user's question based *only* on the context provided below.

### Project Context
- **Name:** ${project.name}
- **Description:** ${project.description || "Not provided."}
- **Creation Date:** ${new Date(project.createdAt).toLocaleDateString()}

### Full Task List
${taskSummary || "_No tasks have been created for this project yet._"}

---
**User's Question:** "${question}"

---
**Your Instructions:**

1.  **Answer Concisely:** Directly address the user's question. Your response should be brief and to the point (2-4 sentences is ideal).
2.  **Strictly Contextual:** Base your answer *exclusively* on the project and task details provided above. Do not invent information or access external knowledge.
3.  **Acknowledge Limitations:** If the provided data is insufficient to answer the question, state that clearly and politely. For example: "Based on the project data, I don't have information about [topic]. You might consider adding more detail to the project description or relevant tasks."
4.  **Group Information:** If asked to list tasks, group them by their status for clarity (e.g., "In the 'To Do' column, there are the following tasks:...").
5.  **Maintain Persona:** Always be helpful and professional.
`;

    const answer = await generateText(prompt);
    res.json({ answer: answer?.trim() || "No answer generated." });
  } catch (err) {
    console.error("Ask AI error:", err);
    res.status(500).json({ error: "AI Q&A failed" });
  }
};
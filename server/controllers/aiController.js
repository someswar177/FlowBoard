import { generateText } from "../utils/geminiClient.js";

export const summarizeProject = async (req, res) => {
  try {
    const { projectData } = req.body;
    const prompt = `Summarize this project concisely:\n${JSON.stringify(projectData)}`;
    const summary = await generateText(prompt);

    res.json({ summary });
  } catch (err) {
    console.error("Summarization error:", err);
    res.status(500).json({ error: "AI summarization failed" });
  }
};

export const askAI = async (req, res) => {
  try {
    const { question, context } = req.body;
    const prompt = `Answer this question based on context:\nContext: ${context}\nQuestion: ${question}`;
    const answer = await generateText(prompt);

    res.json({ answer });
  } catch (err) {
    console.error("Ask AI error:", err);
    res.status(500).json({ error: "AI Q&A failed" });
  }
};

// import Project from "../models/projectModel.js";
// import Task from "../models/taskModel.js";
// import { callGemini } from "../utils/geminiClient.js";

// // POST /api/ai/summarize
// export const summarizeProject = async (req, res) => {
//   try {
//     const { projectId } = req.body;
//     if (!projectId) return res.status(400).json({ message: "projectId is required" });

//     const project = await Project.findById(projectId).lean();
//     if (!project) return res.status(404).json({ message: "Project not found" });

//     const tasks = await Task.find({ projectId }).lean();
//     const tasksSummary = tasks.map((t) => `- ${t.title} [${t.status}] - ${t.description || "No description"}`).join("\n");

//     const prompt = `
// Project: ${project.name}
// Description: ${project.description || "No description"}

// Tasks:
// ${tasksSummary}

// Provide a concise summary (3-5 sentences) and 2-3 suggested next steps.
// `;

//     const aiResponse = await callGemini(prompt, { maxTokens: 300 });
//     const text = aiResponse.output || aiResponse.output_text || aiResponse.text || JSON.stringify(aiResponse);

//     res.json({ summary: text });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // POST /api/ai/ask
// export const askAI = async (req, res) => {
//   try {
//     const { projectId, question } = req.body;
//     if (!projectId || !question) return res.status(400).json({ message: "projectId and question required" });

//     const project = await Project.findById(projectId).lean();
//     if (!project) return res.status(404).json({ message: "Project not found" });

//     const tasks = await Task.find({ projectId }).lean();
//     const tasksContext = tasks.map((t) => `- ${t.title} [${t.status}] - ${t.description || "No description"}`).join("\n");

//     const prompt = `
// Project: ${project.name}
// Description: ${project.description || "No description"}

// Tasks:
// ${tasksContext}

// User question: "${question}"
// `;

//     const aiResponse = await callGemini(prompt, { maxTokens: 300 });
//     const text = aiResponse.output || aiResponse.output_text || aiResponse.text || JSON.stringify(aiResponse);

//     res.json({ answer: text });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

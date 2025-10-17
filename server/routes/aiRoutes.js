// routes/aiRoutes.js
import express from "express";
import { summarizeProject, askAI } from "../controllers/aiController.js";

const router = express.Router();

router.post("/summarize", summarizeProject);
router.post("/ask", askAI);

export default router;
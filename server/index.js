import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("FlowBoard API running...");
});

app.use("/api/projects", projectRoutes);
app.use("/api", taskRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
connectDB()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server start http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err.message);
    process.exit(1);
});

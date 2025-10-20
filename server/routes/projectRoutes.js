import express from "express";
import { 
    getProjects, 
    createProject, 
    getProjectById, 
    updateProject, 
    deleteProject, 
    addColumn 
} from "../controllers/projectController.js";

const router = express.Router();

router.route("/").get(getProjects).post(createProject);
router.route("/:id").get(getProjectById).put(updateProject).delete(deleteProject);

// Route to add a new column to a project
router.route("/:id/columns").post(addColumn);

export default router;
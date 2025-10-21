import express from "express";
import { 
    getProjects, 
    createProject, 
    getProjectById, 
    updateProject, 
    deleteProject, 
    addColumn,
    deleteColumn
} from "../controllers/projectController.js";

const router = express.Router();

router.route("/").get(getProjects).post(createProject);
router.route("/:id").get(getProjectById).put(updateProject).delete(deleteProject);

router.route("/:id/columns").post(addColumn).delete(deleteColumn);

export default router;
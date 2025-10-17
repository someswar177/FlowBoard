import mongoose from "mongoose";

const VALID_STATUSES = ["To Do", "In Progress", "Done"];

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: VALID_STATUSES,
      default: "To Do",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export { VALID_STATUSES };
export default Task;

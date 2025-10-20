import mongoose from "mongoose";

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

export default Task;
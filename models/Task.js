import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      default: "TODO",
    },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "LOW" },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);

export default Task;

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js"; // Import routes
import cors from "cors"; // Optional: To enable cross-origin requests (for React frontend)

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Enable Cross-Origin Requests (CORS) for React to interact with the backend
app.use(cors());

// MongoDB connection string from .env
const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/taskManager";

// Connect to MongoDB
mongoose
  .connect(mongoURI) // No need for useNewUrlParser or useUnifiedTopology anymore
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use taskRoutes to handle /tasks endpoint
app.use("/tasks", taskRoutes);

// Define port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

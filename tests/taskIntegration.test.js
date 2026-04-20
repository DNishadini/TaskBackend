import request from "supertest";
import mongoose from "mongoose";
import express from "express";
import taskRoutes from "../routes/taskRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/tasks", taskRoutes);

describe("Task API Integration Tests", () => {
  // 1. Connection with long timeout for Atlas
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
  }, 30000);

  // 2. Clear data after each test
  afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
      const collections = mongoose.connection.collections;
      if (collections.tasks) {
        await collections.tasks.deleteMany({});
      }
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // This object must match your Mongoose Schema EXACTLY
  const validTask = {
    title: "Integration Test Task",
    description: "Testing with Atlas connection",
    status: "TODO", // Check if your schema expects 'todo' or 'TODO'
    priority: "MEDIUM", // Check if your schema expects 'medium' or 'MEDIUM'
  };

  describe("GET /tasks", () => {
    it("should fetch all tasks", async () => {
      // Create tasks sequentially to avoid race conditions on Atlas
      await request(app)
        .post("/tasks")
        .send({ ...validTask, title: "Task 1" });
      await request(app)
        .post("/tasks")
        .send({ ...validTask, title: "Task 2" });

      const res = await request(app).get("/tasks");

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(2);
    }, 15000); // Individual test timeout
  });

  describe("PUT /tasks/:id", () => {
    it("should update a task", async () => {
      // Create first
      const createRes = await request(app).post("/tasks").send(validTask);

      // If this fails, it means your POST is broken, not the PUT
      if (createRes.statusCode !== 201) {
        console.error("POST setup failed:", createRes.body);
      }

      const taskId = createRes.body._id;
      const res = await request(app)
        .put(`/tasks/${taskId}`)
        .send({ ...validTask, title: "Updated Title" });

      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toBe("Updated Title");
    }, 15000);
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete a task", async () => {
      const createRes = await request(app).post("/tasks").send(validTask);
      const taskId = createRes.body._id;

      const res = await request(app).delete(`/tasks/${taskId}`);
      expect(res.statusCode).toEqual(204);

      const check = await request(app).get("/tasks");
      expect(check.body.length).toBe(0);
    }, 15000);
  });
});

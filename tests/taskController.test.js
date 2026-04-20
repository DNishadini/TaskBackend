import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import Task from "../models/Task.js";

// Mock the Task model module
jest.mock("../models/Task.js");

describe("Task Controller Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    // Reset all mock states before each test
    jest.clearAllMocks();

    // Mock Express response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  // --- CREATE TASK TESTS ---
  describe("createTask", () => {
    const taskData = {
      title: "Test Task",
      description: "Desc",
      status: "TODO",
      priority: "MEDIUM",
    };

    it("should create a task successfully", async () => {
      req = { body: taskData };
      const mockId = "507f1f77bcf86cd799439011";
      const saveMock = jest
        .fn()
        .mockResolvedValue({ ...taskData, _id: mockId });

      // Mock constructor for 'new Task()'
      Task.mockImplementation(() => ({
        ...taskData,
        _id: mockId,
        save: saveMock,
      }));

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ _id: mockId }),
      );
    });

    it("should return 500 if creation fails", async () => {
      req = { body: taskData };
      const saveMock = jest.fn().mockRejectedValue(new Error("DB Error"));
      Task.mockImplementation(() => ({ save: saveMock }));

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Failed to create task" }),
      );
    });
  });

  // --- GET TASKS TESTS ---
  describe("getTasks", () => {
    it("should fetch all tasks successfully", async () => {
      const mockTasks = [{ title: "Task 1" }, { title: "Task 2" }];
      // Mock static method 'find'
      Task.find = jest.fn().mockResolvedValue(mockTasks);

      await getTasks({}, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    it("should return 500 if fetching fails", async () => {
      Task.find = jest.fn().mockRejectedValue(new Error("Find Error"));

      await getTasks({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Failed to fetch tasks" }),
      );
    });
  });

  // --- UPDATE TASK TESTS ---
  describe("updateTask", () => {
    const updateData = { title: "Updated Title" };

    it("should update a task successfully", async () => {
      req = { params: { id: "123" }, body: updateData };
      const updatedTask = { _id: "123", ...updateData };

      // Mock static method 'findByIdAndUpdate'
      Task.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedTask);

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    it("should return 404 if task to update is not found", async () => {
      req = { params: { id: "wrong-id" }, body: updateData };
      Task.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });
  });

  // --- DELETE TASK TESTS ---
  describe("deleteTask", () => {
    it("should delete a task and return 204", async () => {
      req = { params: { id: "123" } };
      // Mock static method 'findByIdAndDelete'
      Task.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: "123" });

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should return 500 if deletion fails", async () => {
      req = { params: { id: "123" } };
      Task.findByIdAndDelete = jest
        .fn()
        .mockRejectedValue(new Error("Delete Error"));

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Failed to delete task" }),
      );
    });
  });
});

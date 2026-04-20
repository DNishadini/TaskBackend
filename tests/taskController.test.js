const { createTask } = require("../controllers/taskController.js");
const Task = require("../models/Task.js");

jest.mock("../models/Task.js"); // Mock the Task model

describe("Task Controller Unit Tests", () => {
  it("should create a task successfully", async () => {
    const taskData = {
      title: "Test Task",
      description: "Test Description",
      status: "TODO",
      priority: "LOW",
    };

    // Create a mock for the instance method save()
    const saveMock = jest.fn().mockResolvedValue({ ...taskData, _id: "12345" });

    // Mock Task constructor to return an object with a mocked save method
    Task.mockImplementation(() => {
      return { save: saveMock }; // Mock `save()` method
    });

    const req = { body: taskData }; // Mock request with task data
    const res = {
      status: jest.fn().mockReturnThis(), // Mock status and chain it with returnThis()
      json: jest.fn(),
    }; // Mock response

    await createTask(req, res); // Call the createTask controller function

    // Check that the response was called with the correct task data
    expect(res.status).toHaveBeenCalledWith(201); // Created status
    expect(res.json).toHaveBeenCalledWith({ ...taskData, _id: "12345" });
    expect(saveMock).toHaveBeenCalledTimes(1); // Ensure save() is called once
  });

  it("should return error if task creation fails", async () => {
    const taskData = {
      title: "Test Task",
      description: "Test Description",
      status: "TODO",
      priority: "LOW",
    };

    // Mocking the save() method to reject with an error
    const saveMock = jest
      .fn()
      .mockRejectedValue(new Error("Error creating task"));
    Task.mockImplementation(() => {
      return { save: saveMock }; // Mock `save()` method
    });

    const req = { body: taskData }; // Mock request with task data
    const res = {
      status: jest.fn().mockReturnThis(), // Mock status for error handling
      json: jest.fn(),
    }; // Mock response

    await createTask(req, res); // Call the createTask controller function

    // Ensure the error is handled properly
    expect(res.status).toHaveBeenCalledWith(500); // Internal server error
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to create task",
      error: "Error creating task",
    });
    expect(saveMock).toHaveBeenCalledTimes(1); // Ensure save() is called once
  });
});

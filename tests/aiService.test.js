jest.mock("node-fetch", () => jest.fn());
const { generateTaskAI } = require("../controllers/aiController.js");
const fetch = require("node-fetch"); // Change from import to require

// Mock the fetch function

describe("AI Service Test", () => {
  it("should return description and priority", async () => {
    // Mock the fetch response
    fetch.mockResolvedValue({
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: `{
                    "description": "Test description",
                    "priority": "HIGH"
                  }`,
                },
              ],
            },
          },
        ],
      }),
    });

    const req = {
      body: { title: "Fix urgent bug" }, // Test input
    };

    const res = {
      json: jest.fn(), // Mock the json method of the response
    };

    await generateTaskAI(req, res); // Call the AI function

    const output = res.json.mock.calls[0][0]; // Capture the mocked response

    // Assert that the output has description and priority
    expect(output).toHaveProperty("description");
    expect(output).toHaveProperty("priority");
    expect(output.description).toBe("Test description");
    expect(output.priority).toBe("HIGH");
  });
});

import fetch from "node-fetch";

export const generateTaskAI = async (req, res) => {
  try {
    const { title } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Given this task title: "${title}", generate:
1. A short task description.
2. A priority (LOW, MEDIUM, HIGH).
Return the output as JSON like this:
{
  "description": "...",
  "priority": "..."
}`,
                },
              ],
            },
          ],
        }),
      },
    );

    const data = await response.json();

    // Let's check what the AI returns
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extracting JSON from AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    let result = {
      description: "Default description due to AI failure.",
      priority: "LOW", // Default in case AI fails
    };

    if (jsonMatch) {
      result = JSON.parse(jsonMatch[0]);
    }

    // Check if the task contains specific keywords to set priority correctly
    if (
      title.toLowerCase().includes("urgent") ||
      title.toLowerCase().includes("asap")
    ) {
      result.priority = "HIGH";
    }

    res.json(result);
  } catch (error) {
    console.error("AI ERROR:", error);

    // Fallback in case of error
    res.json({
      description: "",
      priority: "LOW",
    });
  }
};

import fetch from "node-fetch";

export const generateTaskAI = async (req, res) => {
  try {
    const { title } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Given this task title: "${title}", generate:
1. A short task description
2. A priority (LOW, MEDIUM, HIGH)

Return ONLY JSON like:
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

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON safely
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    let result = {
      description: "",
      priority: "LOW",
    };

    if (jsonMatch) {
      result = JSON.parse(jsonMatch[0]);
    }

    res.json(result);
  } catch (error) {
    console.error("AI ERROR:", error);

    // fallback
    res.json({
      description: "",
      priority: "LOW",
    });
  }
};

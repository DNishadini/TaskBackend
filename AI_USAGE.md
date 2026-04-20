# AI Feature Usage Guide 🤖

## Overview

The AI feature in this task management system helps automate task creation by generating a description and setting the priority based on the task title. The AI uses the **Gemini API** to provide these enhancements.

---

## How to Use the AI for Task Creation 📝

### 1. Send the Request

To use the AI feature, send a **POST** request to the `/api/ai/generate` endpoint. The request body should contain the **task title**.

#### Example Request:

```json
{
  "title": "Complete the team report ASAP"
}
```

### 2. AI Process

Once the request is received, the AI will use the Gemini API to:

    - Generate a short task description.
    - Assign a priority (LOW, MEDIUM, HIGH) based on keywords found in the title.

For example, if the task title contains words like "urgent" or "ASAP", the AI will assign HIGH priority.

### 3. Example Response

The AI will return a JSON response with the generated description and priority.

Example Response:

```JSON
{
  "description": "Complete the team report as soon as possible and submit it to the manager.",
  "priority": "HIGH"
}
```

---

## Fallback Handling

If the AI cannot generate content (e.g., due to an API error), the system will provide a default description and set the priority to LOW.

Example Fallback Response:

```JSON
{
  "description": "Default description due to AI failure.",
  "priority": "LOW"
}
```

---

## Edge Case Handling

The AI will also check for certain keywords in the task title to determine priority. For example:

    - Titles with words like "urgent" or "ASAP" will automatically be set to HIGH priority.
    - Titles without any urgent keywords will default to a LOW priority if the AI is unable to generate a description.

---

## Code Breakdown

Here’s how the AI logic is implemented in aiController.js:

    - The generateTaskAI function takes the task title from the request body.
    - It sends a request to the Gemini API asking for a description and priority.
    - If the AI responds with valid JSON, it is parsed and returned.
    - If there’s an error, the system returns a default response.

Example of the AI Logic:

```JavaScript
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
  }
);

// Handle response
const data = await response.json();
const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
const jsonMatch = text.match(/\{[\s\S]*\}/);
let result = {
  description: "Default description due to AI failure.",
  priority: "LOW",
};

if (jsonMatch) {
  result = JSON.parse(jsonMatch[0]);
}

// Check if the task contains urgent keywords to set priority
if (
  title.toLowerCase().includes("urgent") ||
  title.toLowerCase().includes("asap")
) {
  result.priority = "HIGH";
}

res.json(result);

```

---

## Conclusion

This AI feature is designed to make task creation smarter and more efficient by generating descriptions and setting priorities automatically. It helps streamline the task management process and ensures that every task has the necessary details and urgency levels.

Feel free to test it with different task titles to see how the AI adapts!

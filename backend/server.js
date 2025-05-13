require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.API_KEY;
const aiUrl = process.env.AI_URL || "https://api.openrouter.ai/v1/generate"; // Correct URL for AI API

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Route to get words from AI API
app.post('/get-words', async (req, res) => {
  const { theme = "animals", count = 6 } = req.body;

  try {
    // Create prompt for AI
    const prompt = `Generate a list of ${count} words related to ${theme} suitable for a children's word search game. Example format: ["dog", "cat", "lion"]. Only return the list as a JSON array.`;

    // Request to AI API
    const response = await fetch(aiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        model: "gpt-3.5-turbo",  // Or whichever model you're using
        max_tokens: 100,
      }),
    });

    // Parse the response from AI API
    const data = await response.json();

    if (!data.choices || !data.choices[0].message) {
      throw new Error("Invalid response format from AI");
    }

    const aiText = data.choices[0].message.content;

    // Extract words (assumes AI returns a JSON array like ["dog", "cat", "lion"])
    let words = [];
    try {
      words = JSON.parse(aiText);
    } catch (err) {
      console.error("Error parsing AI response:", err);
    }

    res.json({ words }); // Send the words back to the frontend

  } catch (error) {
    console.error("Error fetching words from AI:", error);
    res.status(500).json({ error: "Failed to fetch words from AI" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const express = require("express");
const cors = require("cors"); // Import cors package
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Ensure this is the correct model name

// Endpoint for chat
app.post("/api/chat", async (req, res) => {
  const userInput = req.body.input; // Get user input from frontend

  try {
    const result = await model.generateContent(userInput);
    const aiResponse = result.response.text(); // Get the generated response from the AI
    res.json({ message: aiResponse }); // Send the AI response back to the frontend
  } catch (err) {
    console.error("Error generating content:", err);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

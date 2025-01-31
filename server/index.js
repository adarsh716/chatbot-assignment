const express = require("express");
const cors = require("cors"); 
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "*", 
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type'], 
};

app.use(cors(corsOptions)); 
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

app.post("/api/chat", async (req, res) => {
  const userInput = req.body.input; 

  try {
    const result = await model.generateContent(userInput);
    const aiResponse = result.response.text(); 
    res.json({ message: aiResponse }); 
  } catch (err) {
    console.error("Error generating content:", err);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

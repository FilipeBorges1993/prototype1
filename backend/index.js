import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { agent } from "./src/agent.js";

dotenv.config();

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());
// *
app.get("/", (req, res) => {
  res.send("Hello from the LangChain-powered backend server!");
});

app.post("/", async (req, res) => {
  const { message } = req.body;

  const response = await agent(message);
  res.json({ response: response.content });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

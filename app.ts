import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables
import { generateContent } from "./controllers/gemini";
import constants from "./constants";

const app = express();
app.use(bodyParser.json());
app.post("/generate", generateContent);

// /test
app.get("/test", (req, res) => {
  res.status(200).send({
    status: 1,
    message: "Server is up and running",
  });
});

app.listen(constants.PORT, () => {
  console.log(`Server running on port ${constants.PORT}`);
});

export default app;

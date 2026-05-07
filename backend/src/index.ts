import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import habitRoutes from "./routes/habits";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running vibe check!" });
});

app.use("/api/habits", habitRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

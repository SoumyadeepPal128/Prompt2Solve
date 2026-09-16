import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./db/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import executeRouter from "./routes/execute.routes.js";
import generateRouter from "./routes/generate.routes.js";
import problemRouter from "./routes/problem.routes.js"
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // your Vite dev server
    credentials: true, // allows cookies/auth headers later, once auth is wired in
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/execute", executeRouter);
app.use("/api/generate", generateRouter);
app.use("/api/problems/",problemRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB, server not started:", err);
    process.exit(1);
  });
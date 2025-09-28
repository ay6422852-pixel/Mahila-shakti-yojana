import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  "https://silly-axolotl-679d7b.netlify.app/login" // deployed frontend
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connect error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;

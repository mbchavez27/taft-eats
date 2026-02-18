import express from "express";
import cors from "cors";

import userRoutes from "./users/user.routes.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173/",
  }),
);

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "Tafts Eats API is running..." });
});

app.use("/api/users/", userRoutes);

export default app;

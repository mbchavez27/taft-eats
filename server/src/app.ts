import express from "express";
import cors from "cors";

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

export default app;

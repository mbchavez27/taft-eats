import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "Tafts Eats API is running..." });
});

export default app;

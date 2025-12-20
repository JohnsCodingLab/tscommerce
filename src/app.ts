import express from "express";
import type { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("API running 🚀");
});

export default app;

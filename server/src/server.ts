import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import cors from "cors";

dotenv.config();
const app = express();
const origin = "http://localhost:3000";
app.use(
  cors({
    origin,
    credentials: true,
  })
);

// added middle wear
app.use(express.json());
app.use(morgan("dev"));
app.get("/", (_, res) => res.send("running"));
app.use("/api/auth", authRoutes);

let port = process.env.LOCAL_PORT;

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);

  AppDataSource.initialize()
    .then(async () => {
      console.log("database initialized...");
    })
    .catch((error) => console.log(error));
});

import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import subRoutes from "./routes/subs";
import postRoutes from "./routes/posts";
import voteRoutes from "./routes/votes";
import userRoutes from "./routes/users";
import cors from "cors";
import cookieParser from "cookie-parser";

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
app.use(cookieParser());
app.use(express.static("public"));
app.get("/", (_, res) => res.send("running"));
app.use("/api/auth", authRoutes);
app.use("/api/subs", subRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/users", userRoutes);

let port = process.env.LOCAL_PORT;

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);

  AppDataSource.initialize()
    .then(async () => {
      console.log("database initialized...");
    })
    .catch((error) => console.log(error));
});

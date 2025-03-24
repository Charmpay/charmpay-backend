import express from "express";
import cors from "cors";
import { config } from "dotenv";
import authRouter from "./routers/auth.js";
import rateLimit from "express-rate-limit";
import syncModel from "./database/syncModel.js";
import userRouter from "./routers/user.js";
import taskRouter from "./routers/task.js";
import transactionRouter from "./routers/transaction.js";
import fundingRouter from "./routers/funding.js";
import beneficiaryRouter from "./routers/beneficiary.js";

config();

const app = express();
const { SERVER_PORT } = process.env;
/**
 * Request limiter, set requests to 300 request per 30 minute for each IP
 */
const rateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  limit: 300, // 300 requests per 30 minutes
  message: {
    message: "Too many request from your device, try again after later",
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);
app.use(express.static("email"));

// log all request made to the console
app.use((req, res, next) => {
  console.log(req.method, req.url);
  res.on("finish", () => {
    console.log(req.method, req.url, res.statusCode, res.statusMessage);
  });
  next();
});

// using routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/funding", fundingRouter);
app.use("/api/beneficiary", beneficiaryRouter);

await syncModel();

app.listen(SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${SERVER_PORT}`);
});

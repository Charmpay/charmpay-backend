import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cron from "node-cron";
import authRouter from "./routers/auth.js";
import rateLimit from "express-rate-limit";
import syncModel from "./database/syncModel.js";
import userRouter from "./routers/user.js";
import taskRouter from "./routers/task.js";
import transactionRouter from "./routers/transaction.js";
import fundingRouter from "./routers/funding.js";
import beneficiaryRouter from "./routers/beneficiary.js";
import notificationsRouter from "./routers/notification.js";
import withdrawRouter from "./routers/withdraw.js";
import { verifyFundingTransaction } from "./controllers/funding.js";
import disputeRouter from "./routers/dispute.js";
import { remindUsers } from "./controllers/task.js";

config();

const app = express();
const { SERVER_PORT } = process.env;

app.set('trust proxy', 1); // trust first proxy
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
app.use("/api/notification", notificationsRouter);
app.use("/api/dispute", disputeRouter);
app.use("/api/withdraw", withdrawRouter);

await syncModel();

cron.schedule("*/5 * * * * *", async () => await verifyFundingTransaction());
cron.schedule("0 0 * * *", async () => await remindUsers());

app.listen(SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${SERVER_PORT}`);
});

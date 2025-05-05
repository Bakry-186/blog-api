import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import "./config/connect.js"; // Connect with db
import ApiError from "./utils/apiError.js";
import globalError from "./middlewares/errorMiddleware.js";
import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import profileRouter from "./routes/profileRoutes.js";

// express app
const app = express();

// Global Middlewares
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 60min
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", adminRouter);
app.use("/api/v1/profiles", profileRouter);

app.use(/.*/, (req, res, next) => {
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalError);

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shuting down.....`);
    process.exit(1);
  });
});

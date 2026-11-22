import express from "express";
import cors from "cors";
import { router as productsRouter } from "./routes/products.js";
import { router as messagesRouter } from "./routes/messages.js";
import * as assignmentController from "./modules/assignments/assignment.controller.js";
import authRouter from "./modules/auth/auth.routes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import logRequest from "./middleware/logRequest.js";
import { userRouter } from "./modules/users/user.routes.js";
import arcjetMiddleware from "./middleware/arcjet.middleware.js";
import authorize from "./middleware/auth.middleware.js";
import subjectRouter from "./modules/subjects/subject.routes.js";
import cookieParser from "cookie-parser";

const app = express();

// Enable CORS for specific origins
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    // Allow the browser to send and receive the auth cookie on API requests.
    // Frontend fetch calls must also set credentials: "include".
    credentials: true,
  }),
);

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Parse the Cookie request header so auth middleware can read req.cookies.
app.use(cookieParser());

// Middleware to log incoming requests
app.use(logRequest);
app.use(arcjetMiddleware);

// Use the imported routers for specific routes
app.use("/products", productsRouter);

// messages route
app.use("/messages", messagesRouter);

// Path: /api/v1/auth/sign-up (POST)
app.use("/api/v1/auth/", authRouter);

// Path: /api/v1/user  (GET)
app.use("/api/v1/users/", userRouter);

app.use("/api/v1/subjects/", subjectRouter);

app.get("/assignments", authorize, assignmentController.getAll);
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Backend Dev")
});

// Keep the error handler after all routes so it can handle their errors.
app.use(errorMiddleware);

app.listen(process.env.PORT || 3000, function () {
  console.log(`Server is running on http://localhost:${process.env.PORT || 3000} 🚀`);
});

/*
  {
    app.get("/", (req, res) => {
      res.status(404); //  only one res.send() is will work.
      res.send("<p style='font-size: xx-large';>Hello from Express</p>");
    });
    
    app.get("/about", (req, res) => {
      res.send("Hello this is about.");
    });
    
    app.get("/contact", (req, res) => {
      res.send("Hello this is contact.");
    });
    
    app.get("/message", (req, res) => {
      res.json({ message: "Hello from your express backend 😁" });
    });
    
  }
*/

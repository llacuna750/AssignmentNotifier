import express, { request, response } from "express";
import cors from "cors";
import { router as productsRouter } from "./routes/products.js";
import { router as messagesRouter } from "./routes/messages.js";
import * as assignmentController from "./modules/assignments/assignment.controller.js";
import authRouter from "./modules/auth/auth.routes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import logRequest from "./middleware/logRequest.js";

const app = express();
const port = 3000;

// Enable CORS for specific origins
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  }),
);

// Middleware to log incoming requests
app.use(logRequest);

// Middleware to parse JSON request bodies
app.use(express.json());


// Use the imported routers for specific routes
app.use("/products", productsRouter);


// messages route
app.use("/messages", messagesRouter);


// Path: /api/v1/auth/sign-up (POST)
app.use("/api/v1/auth/", authRouter);


app.get("/", (request, response) =>
  assignmentController.getAll(request, response),
);

// Keep the error handler after all routes so it can handle their errors.
app.use(errorMiddleware);


app.listen(port, function () {
  console.log(`Server is running on http://localhost:${port} 🚀`);
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

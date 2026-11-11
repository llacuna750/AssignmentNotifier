import express, { request, response } from "express";
import cors from "cors";
import { router as productsRouter } from "./routes/products.js";
import { router as messagesRouter } from "./routes/messages.js";
import * as assignmentController from "./assignments/assignment.controller.js";

const app = express();
const port = 3000;

// Enable CORS for specific origins
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  }),
);

// Middleware to log incoming requests
app.use((request, response, next) => {
  console.log(request.method, request.path);
  next();
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Use the imported routers for specific routes
app.use("/products", productsRouter);
app.use("/messages", messagesRouter);

app.get("/", (request, response) =>
  assignmentController.getAll(request, response),
);

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

import express from "express";
import cors from "cors";
import { router as productsRouter } from "./products.js";
import * as assignmentController from "./assignments/assignment.controller.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  }),
);

app.use("/products", productsRouter);
app.get("/", (req, res) => assignmentController.getAll(req, res));

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
    
    app.post("/message", (req, res) => {
      const { name, message } = req.body;
    
      console.log("New message: ", name, message);
      res.send({ message: "Thank you for your message" });
    });
  
  app.listen(port, function () {
    console.log(`Server is running on http://localhost:${port} 🚀`);
  });
  }
*/
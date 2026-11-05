import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  }),
);

app.use(express.json());

const port = 3000;
app.listen(port, function () {
  console.log(`Server is running on http://localhost:${port} 🚀`);
});

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

app.get("/products", function (req, res) {
  res.json([
    {
      id: 1,
      name: "Laptop",
      price: 1299,
    },
    {
      id: 2,
      name: "Mouse",
      price: 500,
    },
  ]);
});

app.get("/products/:id", (req, res) => {
  const targetId = Number(req.params.id);
  const product = [
    { id: 1, name: "Laptop", price: 1299 },
    { id: 2, name: "Mouse", price: 500 },
  ];
  return res.send(product.find((product) => product.id === targetId));
});

app.get("/message", (req, res) => {
  res.json({ message: "Hello from your express backend 😁" });
});

app.post("/message", (req, res) => {
  const { name, message } = req.body;

  console.log("New message: ", name, message);
  res.send({ message: "Thank you for your message" });
});

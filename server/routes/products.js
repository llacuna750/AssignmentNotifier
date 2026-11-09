import express from "express";
const router = express.Router();

router.get("/", function (req, res) {
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

router.get("/:id", (req, res) => {
  const targetId = Number(req.params.id);
  const product = [
    { id: 1, name: "Laptop", price: 1299 },
    { id: 2, name: "Mouse", price: 500 },
  ];
  return res.send(product.find((product) => product.id === targetId));
});

export { router };

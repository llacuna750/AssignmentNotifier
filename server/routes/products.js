import express from "express";
const router = express.Router();

router.get("/", function (request, response) {
  response.json([
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

router.get("/:id", (request, response) => {
  const targetId = Number(request.params.id);
  const product = [
    { id: 1, name: "Laptop", price: 1299 },
    { id: 2, name: "Mouse", price: 500 },
  ];
  return response.send(product.find((product) => product.id === targetId));
});

export { router };

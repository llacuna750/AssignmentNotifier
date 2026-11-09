import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const { name, message } = req.body;

  console.log("New message: ", name, message);
  res.send({ message: "Thank you for your message" });
});

export { router };

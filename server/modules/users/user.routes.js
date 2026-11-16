import { Router } from "express";
import { getUsers, getUser } from "../users/user.controller.js";
import authorize from "../../middleware/auth.middleware.js";
const userRouter = Router();

userRouter.get("/", authorize, getUsers);
userRouter.get("/:id", authorize, getUser);

export { userRouter };

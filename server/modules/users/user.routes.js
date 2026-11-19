import { Router } from "express";
import { getUsers, getUser, getMe } from "../users/user.controller.js";
import authorize, { requireAdmin } from "../../middleware/auth.middleware.js";
const userRouter = Router();

userRouter.get("/me", authorize, getMe);
userRouter.get("/", authorize, requireAdmin, getUsers);
userRouter.get("/:id", authorize, getUser);

export { userRouter };

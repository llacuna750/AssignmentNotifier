import { Router } from "express";
import { getSubjects, createSubjects } from "./subject.controller.js";
import authorize from "../../middleware/auth.middleware.js";
const subjectRouter = Router();

subjectRouter.get("", authorize, getSubjects);
subjectRouter.post("",authorize, createSubjects);

export default subjectRouter;

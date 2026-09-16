import { Router } from "express";
import { generateProblem } from "../controllers/generate.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { generateProblemValidator } from "../validators/index.js";
import { optionalAuth } from "../middlewares/auth.middleware.js";

const router=Router();

router.post("/", optionalAuth, generateProblemValidator(), validate, generateProblem);

export default router;
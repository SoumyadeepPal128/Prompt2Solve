import { Router } from "express";
import { getAllProblems, getProblemById, deleteProblem } from "../controllers/problem.controller.js";

const router = Router();

router.get("/", getAllProblems);
router.get("/:problemId", getProblemById);
router.delete("/:problemId", deleteProblem);

export default router;
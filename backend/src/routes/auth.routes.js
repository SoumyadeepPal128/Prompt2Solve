import { Router } from "express";
import { registerUser, login, logoutUser, getCurrentUser } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerValidator(), validate, registerUser);
router.post("/login", loginValidator(), validate, login);
router.post("/logout", verifyJWT, logoutUser);
router.get("/me", verifyJWT, getCurrentUser);

export default router;
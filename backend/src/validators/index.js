import { body } from "express-validator";
import { SUPPORTED_LANGUAGES } from "../utils/constants.js";

const generateProblemValidator = () => {
  return [
    body("prompt")
      .trim()
      .notEmpty()
      .withMessage("Prompt is required")
      .isLength({ min: 5 })
      .withMessage("Prompt must be at least 5 characters long"),
  ];
};

const executeCodeValidator = () => {
  return [
    body("problemId").trim().notEmpty().withMessage("problemId is required"),
    body("language")
      .notEmpty()
      .withMessage("language is required")
      .isIn(SUPPORTED_LANGUAGES)
      .withMessage(`language must be one of: ${SUPPORTED_LANGUAGES.join(", ")}`),
    body("code").trim().notEmpty().withMessage("code is required"),
  ];
};

const registerValidator = () => {
  return [
    body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};

const loginValidator = () => {
  return [
    body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

export { generateProblemValidator, executeCodeValidator,loginValidator ,registerValidator };
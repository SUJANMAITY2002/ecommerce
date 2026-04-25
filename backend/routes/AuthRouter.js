import { signup, login } from "../controllers/AuthController.js";
import { signupValidation, loginValidation } from "../Middlewares/AuthValidation.js";

import { Router } from "express";
const router = Router();

router.post('/signin', loginValidation, login);
router.post('/signup', signupValidation, signup);

export default router;
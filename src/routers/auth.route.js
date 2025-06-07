import express from "express";
import * as AuthController from "../controllers/auth.controller.js";
import { AuthGuard } from "../middlewares/auth.js";
import {
  LoginDTO,
  SignupDTO,
} from "../validator/auth.validator.js";

const router = express.Router();

router.post("/sign-up", SignupDTO, AuthController.signup);
router.post("/login", LoginDTO, AuthController.login);

router.get("/logout", AuthGuard, AuthController.logout);

router.get("/authStatus", AuthGuard, AuthController.checkAuth);

export default router;

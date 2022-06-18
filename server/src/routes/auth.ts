import express from "express";
import {
  signup,
  login,
  logout,
  validateSession,
  isAuth,
  changePassword,
} from "../controllers/auth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/session", validateSession);
router.post("/reset", isAuth, changePassword);

export default router;

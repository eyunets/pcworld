import express from "express";
import { isAuth, isAdmin } from "../controllers/auth";
import { read, update } from "../controllers/user";

const router = express.Router();

router.get("/user", isAuth, read);
router.get("/admin", isAuth, isAdmin, read);
router.put("/user", isAuth, update);

export default router;

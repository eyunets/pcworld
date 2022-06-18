import express from "express";
import { isAdmin, isAuth } from "../controllers/auth";
import {
  create,
  read,
  update,
  remove,
  list,
  brandBySlug,
} from "../controllers/brand";

const router = express.Router();

router.get("/brand/:brandSlug", read);
router.post("/brand/create", isAuth, isAdmin, create);
router.put("/brand/:brandSlug", isAuth, isAdmin, update);
router.delete("/brand/:brandSlug", isAuth, isAdmin, remove);
router.get("/brands", list);

router.param("brandSlug", brandBySlug);

export default router;

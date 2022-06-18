import express from "express";
import { isAuth } from "../controllers/auth";
import { read, search, processPayment } from "../controllers/order";

const router = express.Router();

router.get("/orders", isAuth, read);
router.get("/orders/:search", isAuth, search);
router.post("/orders/payment", isAuth, processPayment);

export default router;

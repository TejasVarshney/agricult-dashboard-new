import express from "express";
import { getBuyersCount, getAllBuyers, getBuyerById } from "../controllers/buyerController.js";

const router = express.Router();

router.get("/count", getBuyersCount);
router.get("/", getAllBuyers);
router.get("/:id", getBuyerById);

export default router; 
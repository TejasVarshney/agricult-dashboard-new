import express from "express";
import { getSellersCount, getAllSellers, getSellerById } from "../controllers/sellerController.js";

const router = express.Router();

router.get("/count", getSellersCount);
router.get("/", getAllSellers);
router.get("/:id", getSellerById);

export default router; 
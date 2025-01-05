import express from "express";
import {
  getAllQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
  getQuotesCount,
  getQuotesByRfqId,
  getBidStatus,
  updateQuoteStatus
} from "../controllers/quoteController.js";

const router = express.Router();

// Get routes
router.get("/", getAllQuotes);
router.get("/count", getQuotesCount);
router.get("/rfq/:rfqId", getQuotesByRfqId);
router.get("/:id", getQuoteById);
router.get("/:id/status", getBidStatus);

// Post routes
router.post("/", createQuote);

// Put routes
router.put("/:id", updateQuote);
router.put("/:id/status", updateQuoteStatus);

// Delete routes
router.delete("/:id", deleteQuote);

// Update route for quote status
router.patch("/:id", updateQuoteStatus);

export default router; 
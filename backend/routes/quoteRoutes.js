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
// Add these new routes for approve/reject


// Put routes
router.put("/:id", updateQuote);
router.put("/:id/:status", updateQuoteStatus);

// Delete routes
router.delete("/:id", deleteQuote);

export default router;
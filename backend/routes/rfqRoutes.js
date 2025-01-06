import express from "express";
import {
  getAllRfqs,
  getActiveRfqsCount,
  getEndedRfqsCount,
  getTotalRfqsCount,
  createRfq,
  deleteRfq,
  getRfqById,
  getPendingRfqs,
  updateRfqStatus,
} from "../controllers/rfqController.js";

const router = express.Router();

// Get routes
router.get("/", getAllRfqs);
router.get("/pending", getPendingRfqs);
router.get("/count/active", getActiveRfqsCount);
router.get("/count/ended", getEndedRfqsCount);
router.get("/count/total", getTotalRfqsCount);
router.get("/:id", getRfqById);

// Post routes
router.post("/", createRfq);

// Put routes
router.put("/:id/status", updateRfqStatus);

// Delete routes
router.delete("/:id", deleteRfq);

export default router; 
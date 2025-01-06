import express from "express";
import { 
  getAudioMessages, 
  getChatMessagesByRfqId,
  updateMessageStatus 
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/audio", getAudioMessages);
router.get("/rfq/:rfqId/audio", getChatMessagesByRfqId);
router.put("/audio/:id/status", updateMessageStatus);

export default router; 
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import buyerRoutes from "./routes/buyerRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import rfqRoutes from "./routes/rfqRoutes.js";
import quoteRoutes from "./routes/quoteRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// Initialize environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 1234;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/buyers", buyerRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/rfqs", rfqRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/chat", chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

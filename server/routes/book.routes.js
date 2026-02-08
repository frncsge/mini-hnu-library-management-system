import express from "express";
import {
  authenticateRole,
  authenticateUser,
} from "../middlewares/auth.middleware.js";
import {
  getBooks,
  getBook,
  searchBook,
  getBookDashboardSummary,
} from "../controllers/book.controller.js";

const router = express.Router();

router.get("/api/books", authenticateUser, getBooks);
router.get("/api/books/search", authenticateUser, searchBook);
router.get(
  "/api/books/summary",
  authenticateUser,
  authenticateRole("admin", "librarian"),
  getBookDashboardSummary,
);
router.get("/api/books/:id", authenticateUser, getBook);

export default router;

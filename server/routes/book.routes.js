import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  getBooks,
  getBook,
  searchBook,
} from "../controllers/book.controller.js";

const router = express.Router();

router.get("/api/books", authenticateUser, getBooks);
router.get("/api/books/:id", authenticateUser, getBook);
router.get("/api/books/search", authenticateUser, searchBook);

export default router;

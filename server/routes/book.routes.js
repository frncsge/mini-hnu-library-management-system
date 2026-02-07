import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  getBooks,
  getBook,
  searchBook,
} from "../controllers/book.controller.js";

const router = express.Router();

router.get("/books", authenticateUser, getBooks);
router.get("/books/:id", authenticateUser, getBook);
router.get("/books/search", authenticateUser, searchBook);

export default router;

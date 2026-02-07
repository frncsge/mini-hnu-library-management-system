import redisClient from "../config/redis.config.js";
import {
  getAllBooks,
  getBookById,
  searchBookByTitle,
  searchBookByIsbn,
} from "../models/book.model.js";

export const getBooks = async (req, res) => {
  try {
    //check for cached books
    const cachedBooks = await redisClient.get("books:all");
    if (cachedBooks)
      return res.status(200).json({ books: JSON.parse(cachedBooks) });

    //if no cache, fetch from database
    const books = await getAllBooks();

    //save books in redis with 5 mins ttl
    await redisClient.setEx("books:all", 300, JSON.stringify(books));

    return res.status(200).json({ books });
  } catch (error) {
    console.error("Error getting books request", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getBook = async (req, res) => {
  const bookId = Number(req.params.id);

  try {
    //check if book is cached
    const cachedBook = await redisClient.get(`books:${bookId}`);
    if (cachedBook)
      return res.status(200).json({ book: JSON.parse(cachedBook) });

    //if book is not cached, check for cached books
    const cachedBooks = await redisClient.get("books:all");
    if (cachedBooks) {
      const books = JSON.parse(cachedBooks);
      const book = books.find((book) => book.book_id === bookId);
      if (!book) return res.status(404).json({ message: "Book not found" });

      return res.status(200).json({ book });
    }

    //if no cache, fetch from db
    const book = await getBookById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    //save book in redis with 5 min ttl
    await redisClient.setEx(`books:${bookId}`, 300, JSON.stringify(book));

    return res.status(200).json({ book });
  } catch (error) {
    console.error("Error getting book request", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const searchBook = async (req, res) => {
  const type = req.query.type;
  const query = (req.query.q || "").trim();

  try {
    let books = [];

    if (!query)
      return res.status(400).json({ message: "Query cannot be empty" });

    if (type === "title") {
      books = await searchBookByTitle(query);
    } else if (type === "isbn") {
      books = await searchBookByIsbn(query);
    } else {
      return res
        .status(400)
        .json({ message: "Search type can only be by title or ISBN" });
    }

    res.status(200).json({ books });
  } catch (error) {
    console.error("Error searching book", error);
    return res.status(500).json({ message: "Server error" });
  }
};

import pool from "../config/db.config.js";

export const getAllBooks = async () => {
  try {
    const result = await pool.query("SELECT * FROM book");
    return result.rows;
  } catch (error) {
    console.error("Error getting all books:", error);
    throw error;
  }
};

export const getBookById = async (bookId) => {
  try {
    const result = await pool.query("SELECT * FROM book WHERE book_id = $1", [
      bookId,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error getting book by Id:", error);
    throw error;
  }
};

export const searchBookByTitle = async (title) => {
  try {
    const result = await pool.query("SELECT * FROM book WHERE title ILIKE $1", [
      `%${title}%`,
    ]);
    return result.rows;
  } catch (error) {
    console.error("Error searching book by title:", error);
    throw error;
  }
};

export const searchBookByIsbn = async (isbn) => {
  try {
    const result = await pool.query("SELECT * FROM book WHERE isbn ILIKE $1", [
      `%${isbn}%`,
    ]);
    return result.rows;
  } catch (error) {
    console.error("Error searching book by isbn:", error);
    throw error;
  }
};

export const getBorrowsByStudentId = async (id) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM borrow br
      JOIN student st ON br.student_id = st.student_id
      JOIN users u ON st.user_id = u.user_id
      WHERE u.user_id = $1;
      `,
      [id],
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting borrows by student id:", error);
    throw error;
  }
};

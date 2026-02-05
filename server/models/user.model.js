import pool from "../config/db.config.js";

export const getUserByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
};

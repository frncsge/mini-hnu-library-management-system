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

export const getAdminProfile = async (id) => {
  try {
    const result = await pool.query(
      `
        SELECT 
	        u.user_id,
	        u.email,
	        ad.admin_id,
	        ad.admin_username,
        FROM users u
        JOIN administrator ad ON u.user_id = ad.user_id
        WHERE u.user_id = $1; 
      `,
      [id],
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error getting admin profile:", error);
    throw error;
  }
};

export const getLibrarianProfile = async (id) => {
  try {
    const result = await pool.query(
      `
        SELECT 
	        u.user_id,
	        u.email,
	        lib.librarian_id,
	        lib.first_name,
          lib.last_name
        FROM users u
        JOIN librarian lib ON u.user_id = lib.user_id
        WHERE u.user_id = $1; 
      `,
      [id],
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error getting librarian profile:", error);
    throw error;
  }
};

export const getStudentProfile = async (id) => {
  try {
    const result = await pool.query(
      `
        SELECT 
	        u.user_id,
	        u.email,
	        st.student_id,
	        st.student_school_id,
	        st.first_name,
	        st.last_name
        FROM users u
        JOIN student st ON u.user_id = st.user_id
        WHERE u.user_id = $1; 
      `,
      [id],
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error getting student profile:", error);
    throw error;
  }
};

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

export const getStudentBySchoolId = async (studentSchoolId) => {
  try {
    const result = await pool.query(
      "SELECT * FROM student WHERE student_school_id = $1",
      [studentSchoolId],
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error getting student by school id:", error);
    throw error;
  }
};

export const storeNewStudent = async ({
  email,
  hashedPassword,
  firstName,
  lastName,
  studentSchoolId,
}) => {
  const role = "student";
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      "INSERT INTO users (email, hashed_password, user_role) VALUES ($1, $2, $3) RETURNING user_id",
      [email, hashedPassword, role],
    );
    const newUser = { sub: result.rows[0].user_id, role };

    await client.query(
      "INSERT INTO student (user_id, student_school_id, first_name, last_name) VALUES ($1, $2, $3, $4)",
      [newUser.sub, studentSchoolId, firstName, lastName],
    );

    await client.query("COMMIT");

    return newUser;
  } catch (error) {
    console.error("Error storing new student:", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getAdminProfile = async (id) => {
  try {
    const result = await pool.query(
      `
        SELECT 
	        u.user_id,
          u.user_role,
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
          u.user_role,
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
          u.user_role,
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

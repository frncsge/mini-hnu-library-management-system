import bcrypt from "bcrypt";
import {
  storeNewStudent,
  getUserByEmail,
  getStudentBySchoolId,
} from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/jwt.helper.js";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../utils/authCookies.util.js";
import { cacheRefreshToken } from "../utils/authCache.util.js";

const register = async (req, res) => {
  const {
    email: rawEmail,
    password: rawPassword,
    confirmPassword: rawConfirmPassword,
    firstName: rawFirstName,
    lastName: rawLastName,
    studentSchoolId: rawStudentSchoolId,
  } = req.body;
  const email = rawEmail?.trim();
  const password = rawPassword?.trim();
  const confirmPassword = rawConfirmPassword?.trim();
  const firstName = rawFirstName?.trim();
  const lastName = rawLastName?.trim();
  const studentSchoolId = rawStudentSchoolId?.trim();

  //validate email
  if (!email) return res.status(400).json({ message: "Email is required" });
  const emailPattern = /^[^\s@]+@hnu\.edu\.ph$/; //only login email from holy name university
  if (!emailPattern.test(email))
    return res.status(400).json({ message: "Email must end with @hnu.edu.ph" });

  //check if email is already used
  const user = await getUserByEmail(email);
  if (user) return res.status(400).json({ message: "Email is already in use" });

  //validate password
  if (!password || !confirmPassword)
    return res.status(400).json({ message: "Password is required" });
  const passwordPattern = /^.{8,}$/;
  if (!passwordPattern.test(password))
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  //validate name and id
  const namePattern = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;
  if (!firstName || !namePattern.test(firstName))
    return res.status(400).json({ message: "Invalid first name" });
  if (!lastName || !namePattern.test(lastName))
    return res.status(400).json({ message: "Invalid last name" });

  //validate school id
  const numericStudentSchoolId = Number(studentSchoolId);
  if (isNaN(numericStudentSchoolId))
    return res.status(400).json({ message: "Invalid school id" });

  try {
    //check if school id is already registered
    const registered = await getStudentBySchoolId(numericStudentSchoolId);
    if (registered)
      return res
        .status(400)
        .json({ message: "School ID is already registered" });

    //hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //store new student account
    const newStudentAccount = {
      email,
      hashedPassword,
      firstName,
      lastName,
      studentSchoolId: numericStudentSchoolId,
    };
    const newUser = await storeNewStudent(newStudentAccount);

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    await cacheRefreshToken(refreshToken, newUser);

    //pass access and refresh token cookies
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    res
      .status(201)
      .json({ message: "New student account registered", role: newUser.role });
  } catch (error) {
    console.error("Error registering new student", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default register;

import jwt from "jsonwebtoken";

export const checkLoggedIn = (req, res, next) => {
  const { accessToken } = req.cookies;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessToken) return next(); //if no access token, proceed with login

  try {
    const decoded = jwt.verify(accessToken, accessTokenSecret);
    //if token is valid, user is already logged in
    return res.status(200).json({ message: "You are already logged in" });
  } catch (error) {
    //if access token is invalid, proceed with login
    next();
  }
};

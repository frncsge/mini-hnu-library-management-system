import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  return jwt.sign(user, accessTokenSecret, { expiresIn: "10m" });
};

export const generateRefreshToken = (user) => {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  return jwt.sign(user, refreshTokenSecret);
};

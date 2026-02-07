import redisClient from "../config/redis.config.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/jwt.helper.js";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../utils/authCookies.util.js";
import { cacheRefreshToken } from "../utils/authCache.util.js";
import { clearJwtCookies } from "../utils/authCookies.util.js";

const getNewAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken)
    return res.status(401).json({ message: "No access token provided" });

  try {
    const cachedRefreshToken = await redisClient.get(
      `refreshToken:${refreshToken}`,
    );
    if (!cachedRefreshToken) {
      //force signout if there is no refresh token stored
      clearJwtCookies(res);
      return res.status(401).json({ message: "Session expired" });
    }

    //remove used refresh token to avoid reuse
    await redisClient.del(`refreshToken:${refreshToken}`);

    //generate new access token and refresh token
    const { sub, role } = JSON.parse(cachedRefreshToken);
    const user = { sub, role };
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    await cacheRefreshToken(`refreshToken:${newRefreshToken}`, user);

    //store jwt tokens in httpOnly cookie
    setAccessTokenCookie(res, newAccessToken);
    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({ message: "Tokens refreshed" });
  } catch (error) {
    console.error("Error getting new access token:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default getNewAccessToken;

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

export const authenticateUser = (req, res, next) => {
  const { accessToken } = req.cookies;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessToken)
    return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(accessToken, accessTokenSecret);

    //create user object key
    const { sub, role } = decoded;
    req.user = { id: sub, role };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid access token" });
  }
};

export const authenticateRole = (...requiredRoles) => {
  return (req, res, next) => {
    if (!requiredRoles.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden" });

    next();
  };
};

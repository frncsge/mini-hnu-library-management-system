export const setAccessTokenCookie = (res, accessToken) => {
  const ttl = 10 * 60 * 1000; //10 mins
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: ttl,
  });
};

export const setRefreshTokenCookie = (res, refreshToken) => {
  const ttl = 7 * 24 * 60 * 60 * 1000; //7 days

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: ttl,
  });
};

export const clearJwtCookies = (res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
};

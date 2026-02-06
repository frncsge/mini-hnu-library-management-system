import redisClient from "../config/redis.config.js";

export const cacheOtp = async (email, value) => {
  const key = `otp:${email}`;
  const ttl = 2 * 60; //2 mins

  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error("Error caching OTP:", error);
    throw error;
  }
};

export const deleteOtpFromCache = async (email) => {
  const key = `otp:${email}`;

  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Error deleting OTP from cache:", error);
    throw error;
  }
};

export const cacheRefreshToken = async (refreshToken, value) => {
  const key = `refreshToken:${refreshToken}`;
  const ttl = 7 * 24 * 60 * 60; //7 days

  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error("Error caching refresh token:", error);
    throw error;
  }
};

export const cacheOtpSendCooldown = async (email) => {
  const key = `otpSendCooldown:${email}`;
  const ttl = 60; //60 seconds cooldown

  try {
    await redisClient.setEx(key, ttl, "OTP send cooldown");
  } catch (error) {
    console.error("Error caching OTP resend cooldown:", error);
    throw error;
  }
};

export const trackOtpAttempts = async (email, incr) => {
  const key = `otpAttempts:${email}`;
  const maxAttempts = 5;
  const ttl = 3 * 60; //3 minutes before user get to verify OTP again

  try {
    //get current attempts
    let attempts = parseInt(await redisClient.get(key)) || 0;

    if (incr && attempts < maxAttempts) {
      //increment attempts
      attempts = await redisClient.incr(key);

      //if this is the first attempt, start timer
      if (attempts === 1) {
        await redisClient.expire(key, ttl);
      }
    }

    const timeLeft = await redisClient.ttl(key);
    const blocked = attempts >= maxAttempts;

    return { blocked, attempts, maxAttempts, timeLeft };
  } catch (error) {
    console.error("Error incrementing OTP verification attempts:", error);
    throw error;
  }
};

export const resetOtpAttempts = async (email) => {
  const key = `otpAttempts:${email}`;

  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Error resetting OTP attempts:", error);
    throw error;
  }
};

export const cachePendingLogin = async (email, user) => {
  const key = `pendingLogin:${email}`;
  const ttl = 300; //300 seconds or 5 minutes

  try {
    await redisClient.setEx(key, ttl, JSON.stringify(user));
  } catch (error) {
    console.error("Error caching pending login:", error);
    throw error;
  }
};

export const getPendingLogin = async (email) => {
  const key = `pendingLogin:${email}`;

  try {
    const pending = await redisClient.get(key);
    return pending;
  } catch (error) {
    console.error("Error getting pending login:", error);
    throw error;
  }
};

export const deletePendingLogin = async (email) => {
  const key = `pendingLogin:${email}`;

  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Error getting pending login:", error);
    throw error;
  }
};

import redisClient from "../config/redis.config.js";
import {
  getAdminProfile,
  getLibrarianProfile,
  getStudentProfile,
} from "../models/user.model.js";
import { getBorrowsByStudentId } from "../models/book.model.js";

export const getMyProfile = async (req, res) => {
  const { id, role } = req.user;

  try {
    let profile;

    //check if user profile is in cache
    const cachedProfile = await redisClient.get(`myProfile:${id}`);
    if (cachedProfile)
      return res.status(200).json({ profile: JSON.parse(cachedProfile) });

    if (role === "student") {
      profile = await getStudentProfile(id);
    } else if (role === "admin") {
      profile = await getAdminProfile(id);
    } else if (role === "librarian") {
      profile = await getLibrarianProfile(id);
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    //cache fetched profile
    await redisClient.setEx(`myProfile:${id}`, 300, JSON.stringify(profile));

    res.status(200).json({ profile });
  } catch (error) {
    console.error("Error getting my profile", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBorrows = async (req, res) => {
  const { id } = req.user;

  try {
    //check cache for borrows if there's any
    const cachedBorrows = await redisClient.get(`borrows:${id}`);
    if (cachedBorrows)
      return res.status(200).json({ borrows: JSON.parse(cachedBorrows) });

    const borrows = await getBorrowsByStudentId(id);

    //save borrows in redis with 5 mins ttl
    await redisClient.setEx(`borrows:${id}`, 300, JSON.stringify(borrows));

    return res.status(200).json({ borrows });
  } catch (error) {
    console.error("Error getting borrows", error);
    return res.status(500).json({ message: "Server error" });
  }
};

import express from "express";
const router = express.Router();

import {
	getUser,
	getUserBlogs,
	getUserFollowing,
	getUserFollowers,
	addRemoveFollowing,
	addRemoveFollower
} from "../controllers/user.js";

router.get("/:id/blogs", getUserBlogs);
router.get("/:id/following", getUserFollowing);
router.get("/:id/followers", getUserFollowers);
router.get("/:id", getUser);

router.patch("/:id/following/:followingID", addRemoveFollowing);
router.patch("/:id/followers/:followerID", addRemoveFollower);


export default router;

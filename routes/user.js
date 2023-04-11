import express from "express";
const router = express.Router();

import {
	getUser,
	getUserBlogs,
	getUserFollowing,
	getUserFollowers,
	addRemoveFollowing,
	addRemoveFollower,
	updateUser,
	// Searchbyuser,
	getAllUsers
} from "../controllers/user.js";

router.get("/:id/blogs", getUserBlogs);
router.get("/:id/following", getUserFollowing);
router.get("/:id/followers", getUserFollowers);
router.get("/:id", getUser);
router.get("/",getAllUsers);
// router.get("/searchbyuser/:name",Searchbyuser);
router.patch("/:id/following/:followingID", addRemoveFollowing);
router.patch("/:id/followers/:followerID", addRemoveFollower);
router.patch("/update/:id",updateUser);



export default router;

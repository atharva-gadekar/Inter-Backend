import express from "express";
const router = express.Router();

import {
	getUser,
	updateUser,
	// Searchbyuser,
	getUserBlogs,
	getAllUsers,
	getAllBlogsByUser,
	searchByAllInterests,
	searchByOneInterest,
	addRemoveConnection,
	getUserConnections,
	notifyUser,
	getUserNotifications,
	ignoreConnection
} from "../controllers/user.js";




router.get("/:id/userblogs", getAllBlogsByUser);
router.get("/:id/blogs", getUserBlogs);
router.get("/:id/following", getUserConnections);
router.get("/:id/connections", getUserConnections);
router.get("/:id/interests/all", searchByAllInterests);
router.get("/:id/getNotifications/", getUserNotifications);

router.get("/:id", getUser);
router.get("/", getAllUsers);

router.post("/notify", notifyUser);

// router.get("/searchbyuser/:name",Searchbyuser);
router.patch("/:id/following/:followingID", addRemoveConnection);
router.patch("/:id/connect/:connectionID", addRemoveConnection);
router.patch("/:id/ignore/:connectionID", ignoreConnection);

router.patch("/update/:id", updateUser);

router.get("/:id/:interest", searchByOneInterest);



export default router;

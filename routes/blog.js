import express from "express";
const router = express.Router();

import {
	getAllBlogs,
	getBlog,
	addComment,
	addLike,
	// SearchbyTag,
	// SearchbyTitle,
} from "../controllers/blog.js";

router.get("/", getAllBlogs);
router.get("/:id", getBlog);
// router.get("/searchbytag/:tags",SearchbyTag);
// router.get("/searchbytitle/:title",SearchbyTitle);
router.post("/:id/comment", addComment);
router.patch("/:id/like", addLike);


export default router;

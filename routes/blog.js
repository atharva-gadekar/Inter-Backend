import express from "express";
const router = express.Router();

import {
	getAllBlogs,
	addComment,
	addLike,
} from "../controllers/blog.js";

router.get("/", getAllBlogs);
// router.get("/:id", getBlog);
router.post("/:id/comment", addComment);
router.patch("/:id/like", addLike);


export default router;

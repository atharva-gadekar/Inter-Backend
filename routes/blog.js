import express from "express";
const router = express.Router();

import {
	getAllBlogs,
	getBlog,
	createBlog,
	addComment,
	addLike,
} from "../controllers/blog.js";

router.get("/blog", getAllBlogs);
router.get("/blog/:id", getBlog);

router.post("/blog/:id/comment", addComment);
router.patch("/blog/:id/like", addLike);


export default router;

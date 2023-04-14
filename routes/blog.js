import express from "express";
const router = express.Router();

import {
	getAllBlogs,
	addComment,
	deleteBlog,
	addLike,
	// deleteComment/,
	updateblog,
	// getAllComments,

} from "../controllers/blog.js";

router.get("/", getAllBlogs);
// router.get("/:id", getBlog);
router.patch("/:id/like", addLike);
router.post("/:id/comment", addComment);
router.patch("/update/:id", updateblog);
router.delete("/delete/:id", deleteBlog);
// router.delete("/:id/comments/:id",deleteComment);
// router.get("/:id/comments",getAllComments);

export default router;

import express from "express";
const router = express.Router();

import {
	getAllBlogs,
	getBlog,
	addComment,
	deleteBlog,
	addLike,
	// deleteComment/,
	updateblog,
	// getAllComments,

} from "../controllers/blog.js";

router.get("/", getAllBlogs);
router.get("/:id", getBlog);
// router.get("/searchbytag/:tags",SearchbyTag);
// router.get("/searchbytitle/:title",SearchbyTitle);
router.post("/:id/comment", addComment);
router.patch("/:id/like", addLike);
router.patch("/update/:id",updateblog);
router.delete("/delete/:id",deleteBlog);
// router.delete("/:id/comments/:id",deleteComment);
// router.get("/:id/comments",getAllComments);

export default router;

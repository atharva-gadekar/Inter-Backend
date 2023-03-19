import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
	content: {
		type: String,
		required: true,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	blogID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Blog",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export const Comment = mongoose.model("Comment", commentSchema);

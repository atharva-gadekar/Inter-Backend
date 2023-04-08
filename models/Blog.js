	import mongoose from "mongoose";

	const blogSchema = new mongoose.Schema({
		title: {
			type: String,
			required: true,
		},
		bannerImage: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			default: Date.now,
		},
		timeToRead: {
			type: Number,
			required: false,
		},
		likes: {
			type: Map,
			of: Boolean,
		},
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		tags: [
			{
				type: String,
				required: false,
			},
		],
		content: {
			type: String,
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		bannerUrl : {
			type: String,
			required: false
		}
	});

	export const Blog = mongoose.model("Blog", blogSchema);

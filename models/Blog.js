	import mongoose from "mongoose";

	const blogSchema = new mongoose.Schema({
		title: {
			type: String,
			required: true,
		},
		brief: {
			type: String,
			required:true,
		},
		date: {
			type:Date,
			default: Date.now,
		}
	,
		bannerImage: {
			type: String,
			required: true,
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

	blogSchema.virtual('formattedDate').get(function () {
		const date = new Date(this.date);
		const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
		return formattedDate;
	  });

	export const Blog = mongoose.model("Blog", blogSchema);

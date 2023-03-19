import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	picture: {
		type: String,
		required: true,
	},
	collegeName: {
		type: String,
		required: true,
	},
	year: {
		type: Number,
		required: true,
	},
	branch: {
		type: String,
		required: true,
	},
	interests: {
		type: [String],
		required: true,
	},
	following: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	followers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export const User = mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: false,
	},
	about: {
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
	username: {
		type: String,
		required: false,
	},
	resetLink: {
		type: String,
		required: false,
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
		required: false,
	},
	branch: {
		type: String,
		required: true,
	},
	interests: {
		type: [String],
		required: false,
	},
	title: {
		type: String,
		required: false,
	},
	about: {
		type: String,
		required: false,
	},
	url: {
		type: String,
		required: false,
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
	connections: [
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
	likedTags: [
		{ 
			type: String,
			required: false 
		}],
	notifications: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Notification",
		}
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export const User = mongoose.model("User", userSchema);

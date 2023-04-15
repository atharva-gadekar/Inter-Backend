import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
	receiver: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	message: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export const Notification = mongoose.model("Notification", notificationSchema);

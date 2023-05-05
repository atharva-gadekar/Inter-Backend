import mongoose from "mongoose";
// import { Message } from "./message";

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      unique: true, // make members field unique
    },
    lastMessage: {
      type: String,
    },
    lastMessageTime: {
      type: Date,
    },
   
  },
  { 
    timestamps: true
  },
);

export const Conversation = mongoose.model("Conversation", ConversationSchema);

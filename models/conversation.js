import mongoose from "mongoose";
// import { Message } from "./message";

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
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

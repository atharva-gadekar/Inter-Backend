import express from "express";
const router = express.Router();
import { Message } from "../models/message.js";
import { Conversation } from "../models/conversation.js";


//add

router.post("/", async (req, res) => {
  const { conversationId, sender, text } = req.body;
  const message = new Message({ conversationId, sender, text });
  // const m=await message.save();
  // const conversation = await Conversation.findById(conversationId);
  // conversation.lastMessageTime = message.createdAt;
  // // const lastMessage = await Message.findOne({ conversationId }).sort({ createdAt: -1 }).select('text');
  // conversation.lastMessage = m.text// set only the text field
  //   const c=await conversation.save();
  //   res.status(200).json(m.text);

  
    try {
      const savedMessage = await message.save();
      
      const conversation = await Conversation.findById(conversationId);
      conversation.lastMessageTime = message.createdAt;
      conversation.lastMessage = savedMessage.text;
      console.log("Message saved in left chat")
       // set only the text field
      const savedConversation = await conversation.save();
  
      res.status(200).json({savedConversation, savedMessage});
    } catch (err) {
      res.status(500).json(err);
    }
    
   
});

//get

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

// module.exports = router;
export default router;
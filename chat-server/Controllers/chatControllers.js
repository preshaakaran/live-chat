const asyncHandler = require("express-async-handler");


const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { senderId, participantId } = req.body; 

  if (!participantId || !senderId) {
    console.log("SenderId or participantIds not sent with request");
    return res.sendStatus(400);
  }

  
  const chat = await Chat.findOne({
    participantIds:{ $all: [senderId, participantId] },
    isGroupChat: false,
  });

  if (chat) {
    return res.status(200).send(chat);
  }


  const newChat = await Chat.create({
    senderId,
    participantIds: [senderId, participantId], 
    isGroupChat: false,
  });

  if (!newChat) {
    res.status(400);
    throw new Error("Chat Not Found");
  } else {
    res.status(200).send(newChat);
  }
});


const fetchChats = asyncHandler(async (req, res) => {
  const senderId = req.query.senderId || req.body.senderId;

  if (!senderId) {
    console.log("SenderId not sent with request");
    return res.sendStatus(400);
  }
  try {
    
    const chats = await Chat.find({
      participantIds: {$in:[senderId]},
      isGroupChat: false,
    });

    if (!chats || chats.length === 0) {
      return res.status(404).json({ message: "No chats found for this senderId" });
    }
    return res.status(200).send(chats);
  } catch (error) {
    res.status(400);
    console.log("Chat not found");
    throw new Error(error.message);
  }
});



module.exports = {
  accessChat,
  fetchChats,

};
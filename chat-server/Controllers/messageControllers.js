const expressAsyncHandler = require("express-async-handler");


const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const allMessages = expressAsyncHandler(async (req, res) => {
  const sender = req.user._id;
  try {
    console.log("Chat ID : ", req.params.chatId);
    console.log("Sender ID : ", sender);
  
    const messages = await Message.find(
      { chat: {$all:[sender, req.params.chatId] }},
    ).sort({ timestamp: 1 })
      .populate("sender", "name email")
      .populate("receiver")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { sender,content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: sender,
    receiver: chatId,
    content: content,
    chat: [sender,chatId],
  };

  try {
    var message = await Message.create(newMessage);

    console.log(message);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await message.populate("receiver");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
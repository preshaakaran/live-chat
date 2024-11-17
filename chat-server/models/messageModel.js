const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true, 
      },
      receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: {
        type: String,
        trim: true,
        required: true, 
      },

      chat: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true, 
      },
      timestamp: { type: Date, default: Date.now },

});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message


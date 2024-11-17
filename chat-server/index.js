const express = require('express');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  pingTimeout: 60000,
});
dotenv.config();
app.use(express.json());

app.use(cors({
    origin: '*',
  }))


const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    }catch(error){
        console.error('Error connecting to MongoDB', error);
        
    }
}

connectDB();


app.get('/', (req, res) => {
  res.send('API running');
});



let onlineUsers = {};




io.on('connection', (socket) => {
  console.log('User connected: ', socket.id);
  


  socket.on("setup", (userData) => {
    socket.join(userData.data._id);
    console.log(`User ${userData.data._id} joined their room`);
    onlineUsers[socket.id]=userData.data._id;
    io.emit('online users', onlineUsers);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  

  socket.on("new message", (newMessageStatus) => {
    
    var chats = newMessageStatus;
    if (!chats) return console.log("chat.users not defined");

    console.log("Chat.users: ", chats);
    chats.chat.map((user) => {
      if (user === newMessageStatus.sender._id) {
        return;
      }
      
      socket.in(user).emit("message received", newMessageStatus);
      
      console.log("Message sent to: ", user);
    });




  });

  
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    io.emit('online users', onlineUsers);
    socket.leave(userData._id);

  });
});



app.use('/user', userRoutes);
app.use('/chat',chatRoutes);
app.use('/message',messageRoutes);
app.use(notFound);
app.use(errorHandler);




const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
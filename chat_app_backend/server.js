const express = require('express');
const {chats} = require('./data/data');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = express();
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { allUser } = require('./controllers/userControllers');
const path = require('path');
const cors = require('cors');



dotenv.config();

connectDB();

const port = process.env.PORT || 5000;

app.use(cors({
    origin: "https://web-tech-project-ten.vercel.app",
    optionsSuccessStatus: 200
}))

app.use(express.json()); // TO accept json data

app.use('/api/user',userRoutes);

app.use('/api/chat',chatRoutes);

app.use('/api/message',messageRoutes);

const __dirname1 = path.resolve();

if(process.env.NODE_ENV = 'production'){
    app.use(express.static(path.join(__dirname1,"../chat_app_frontend/build")));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname1,"../chat_app_frontend","build","index.html"));
    });
}
else{
    app.get('/',(req,res)=> {
        // res.send("Hello World");
        console.log(`API is running successfully`);
    });
}

app.use(notFound);
app.use(errorHandler);

const server = app.listen(5000, () => console.log(`Example app listening on port ${port}!`.yellow.bold));  

const io = require('socket.io')(server,{
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
});

io.on("connection",(socket)=>{
    console.log("connected to socket.io");
    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    });
    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("User joined room: " + room);
    });

    socket.on("typing",(room)=>socket.in(room).emit("typing"));
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));

    socket.on("new message",(newMessageReceived)=>{
        var chat = newMessageReceived.chat;
        if(!chat.users) return console.log("chat.users not defined");
        chat.users.forEach(user => {
            if(user._id === newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received",newMessageReceived);
        });
    });

    socket.off("setup",()=>{
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });

})


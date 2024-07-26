const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
const port = process.env.DPORT || 5000;

// CORS configuration
const corsOptions = {
    origin: ["https://vaarta.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

// Apply CORS globally
app.use(cors(corsOptions));

// Middleware
app.use(express.json()); // To accept JSON data

// Routes
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// Serve static files in production
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, "../chat_app_frontend/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "../chat_app_frontend", "build", "index.html"));
    });
} else {
    app.get('/', (req, res) => {
        console.log(`API is running successfully`);
        res.send("API is running successfully");
    });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const server = app.listen(port, '0.0.0.0', () => console.log(`Server listening on port ${port}!`.yellow.bold));

// Socket.IO setup
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: corsOptions
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
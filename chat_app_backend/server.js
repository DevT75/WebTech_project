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

dotenv.config();

connectDB();

const port = process.env.PORT || 5000;

app.use(express.json()); // TO accept json data

app.get('/',(req,res)=> {
    // res.send("Hello World");
    console.log(`Server started on port ${port}`)
});

app.use('/api/user',userRoutes);

app.use('/api/chat',chatRoutes);

app.use('/api/message',messageRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(5000, () => console.log(`Example app listening on port ${port}!`.yellow.bold));  
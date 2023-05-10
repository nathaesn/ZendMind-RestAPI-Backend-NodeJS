const express = require('express')
const app = express()
const port = 3000

const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const server = http.createServer(app);
const io = socketIO(server);

const models = require('./models/');
const message = models.Message;

app.use(express.json())

app.get('/', (req, res) => res.send('Welcome to Zendmind Server!!!, this is private server'));



//Make Variable for route location
const authRoute = require('./routes/all-access/auth')
const articleRoutes = require('./routes/all-access/ArticleRoutes');
const notificationRoutes = require('./routes/all-access/NotificationRoutes');
const messageRoutes = require('./routes/all-access/MessageRoutes');
const moodRoutes = require('./routes/all-access/MoodRoutes');


app.use((req, res, next) => {
  req.io = io;
  next();
});

app.set('io', io);

//Make Routes Authentification
app.use('/api/auth', authRoute)

//Make Routes Article
app.use('/api/articles', articleRoutes);

//Make Routes Notification
app.use('/api/notifications', notificationRoutes);

//Make Routes Mood
app.use('/api/moods', moodRoutes);

//Make Routes Message
app.use('/api/messages', messageRoutes);

io.on('connect', (socket) => {
  console.log('a user connected');

  // Join room
  // const roomId = 'zendmind';
  // socket.join(roomId);
  // console.log(`User joined room ${roomId}`);

  // Emit event to room
  // io.to(roomId).emit('chat', 'A new user joined the room');

});




io.on('disconnect', () => {
  console.log('Disconnected from server');
});


server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
// app.listen(port, () => console.log(`Successfully to start😱😱😱 : http://127.0.0.1:${port}, Lupakan titik koma`));
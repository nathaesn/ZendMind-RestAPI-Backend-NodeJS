const express = require('express')
const app = express()
const port = 3000

const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const server = http.createServer(app);
const io = socketIO(server);

const models = require('../ZendMind-RestAPI-Backend-NodeJS/models/');
const message = models.Message;

app.use(express.json())

app.get('/', (req, res) => res.send('Welcome to Zendmind Server!!!, this is private server'));



//Make Variable for route location
const authRoute = require('./routes/all-access/auth')
const articleRoutes = require('./routes/all-access/ArticleRoutes');
const notificationRoutes = require('./routes/all-access/NotificationRoutes');
const messageRoutes = require('./routes/all-access/MessageRoutes');
const moodRoutes = require('./routes/all-access/MoodRoutes');

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

io.on('connection', (socket) => {
  console.log('a user connected');

  message.findAll({ limit: 10, order: [['createdAt', 'ASC']] }).then((chats) => {
    socket.emit('chats', chats.reverse());
  });

  // Menangani pengiriman chat baru
  socket.on('chat', (data) => {
    message.create(data).then(() => {
      io.emit('chat', data);
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});


server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
// app.listen(port, () => console.log(`Successfully to start😱😱😱 : http://127.0.0.1:${port}, Lupakan titik koma`));
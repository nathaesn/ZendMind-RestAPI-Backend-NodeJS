const express = require('express')
const app = express()
const port = 3000

const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json())

app.get('/', (req, res) => res.send('Welcome to Zendmind Server!!!, this is private server'));



//Make Variable for route location
const authRoute = require('./routes/all-access/auth')
const articleRoutes = require('./routes/all-access/ArticleRoutes');
const notificationRoutes = require('./routes/all-access/NotificationRoutes');
const messageRoutes = require('./routes/all-access/MessageRoutes');

//Make Routes Authentification
app.use('/api/auth', authRoute)

//Make Routes Article
app.use('/api/articles', articleRoutes);

//Make Routes Notification
app.use('/api/notifications', notificationRoutes);

//Make Routes Message
app.use(bodyParser.json());
app.use('/api/messages', messageRoutes);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});



app.listen(port, () => console.log(`Successfully to start😱😱😱 : http://127.0.0.1:${port}, Lupakan titik koma`));
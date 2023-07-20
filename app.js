const express = require('express')
const app = express()
const port = 3000

const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const server = http.createServer(app);
const io = socketIO(server);
const path = require('path');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'public/html', 'landingPage/index.html');
  res.sendFile(filePath);
});



//Make Variable for route location
const authRoute = require('./routes/all-access/auth')
const articleRoutes = require('./routes/all-access/ArticleRoutes');
const notificationRoutes = require('./routes/all-access/NotificationRoutes');
const messageRoutes = require('./routes/all-access/MessageRoutes');
const mentorProfileRoute = require('./routes/mentor/mentorProfile');
const moodRoutes = require('./routes/all-access/MoodRoutes');


app.use((req, res, next) => {
  req.io = io;
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.set('io', io);

//Make Routes Authentication
app.use('/api/auth', authRoute)

//Make Routes Article
app.use('/api/articles', articleRoutes);

//Make Routes Notification
app.use('/api/notifications', notificationRoutes);

//Make Routes Mood
app.use('/api/moods', moodRoutes);

//Make Routes Message
app.use('/api/messages', messageRoutes);

//Make Routes Consultation
app.use('/api/consultation', messageRoutes);

//Make Routes Mentor
app.use('/api/mentor/profile', mentorProfileRoute);

//Make Routes Admin
app.use('/api/admin/mentor', mentorProfileRoute);


const multer  = require('multer'); 

app.use(express.static('public'));
const uploadDir = '/img/';
const storage = multer.diskStorage({
    destination: "./public"+uploadDir,
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err)  

        cb(null, raw.toString('hex') + path.extname(file.originalname))
      })
    }
})

io.on('connect', (socket) => {
  console.log('a user connected');

  // Join room
  const roomId = 'zendmind';
  socket.join(roomId);
  console.log(`User joined room ${roomId}`);

  // Emit event to room
  io.to(roomId).emit('chat', 'A new user joined the room');

});




io.on('disconnect', () => {
  console.log('Disconnected from server');
});



server.listen(port, () => console.log(`Successfully to start😱😱😱 : http://127.0.0.1:${port}, Lupakan titik koma`));
// app.listen(port, () => console.log(`Successfully to start😱😱😱 : http://127.0.0.1:${port}, Lupakan titik koma`));
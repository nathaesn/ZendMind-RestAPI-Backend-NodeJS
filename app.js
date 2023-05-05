const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Welcome to Zendmind Server!!!, this is private server'));

const authRoute = require('./routes/all-access/auth')

//AUTH ROUTES
app.use('/api/auth', authRoute)

app.listen(port, () => console.log(`Successfully to start😱😱😱 : http://127.0.0.1:${port}, Lupakan titik koma`));
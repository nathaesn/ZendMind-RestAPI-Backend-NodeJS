const express = require('express')
const app = express()
const port = 3000


app.use(express.json())

app.get('/', (req, res) => res.send('Welcome to Zendmind Server!!!, this is private server'));



//Make Variable for route location
const authRoute = require('./routes/all-access/auth')
const articleRoutes = require('./routes/all-access/ArticleRoutes');

//Make Routes Authentification
app.use('/api/auth', authRoute)

//Make Routes Article
app.use('/api/articles', articleRoutes);



app.listen(port, () => console.log(`Successfully to start😱😱😱 : http://127.0.0.1:${port}, Lupakan titik koma`));
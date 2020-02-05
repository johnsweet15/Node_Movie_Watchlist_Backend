// import package
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv/config')

// connect to database
mongoose.connect(process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('Connected to DB')
)

// Middlewares
app.use(cors())
app.use(bodyParser.json())

// Route Middlewares
const watchlistRoute = require('./routes/watchlist')
const authRoute = require('./routes/auth')

app.use('/api/watchlist', watchlistRoute)
app.use('/api/user', authRoute)

// listen on port 3000
app.listen(5000)
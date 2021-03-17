const express = require('express')
const cors = require('cors')
const users = require('./routes/user')

const app = express()

//Settings
app.set('port', process.env.PORT || 4000)

app.use(express.json())
app.use(cors({ origin: true }))

//Middlewares
app.use(express.urlencoded({extended: false}))

//Routes
//app.use(require('../functions/routes/index'));
app.use(require('./routes/index'))
app.use('/user', users)

//Static files
app.use(express.static(path.join(__dirname, 'public')))


module.exports = app
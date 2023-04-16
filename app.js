const express = require('express')
const router = require('./router')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')

let sessionOptions = session({
    secret: "jnsjkvnjksvmkjsnjd",
    store : MongoStore.create({client : require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie : {maxAge : 1000 * 60 * 60 * 24 , httpOnly : true}
})

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.use(sessionOptions)
app.use(flash())

app.use('/', router)

app.set('views', 'views')
app.set('view engine', 'ejs')


module.exports = app
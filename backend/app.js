const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')

app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())

const todoRouter = require('./todoRouter')
app.use('/api/todos', todoRouter)

module.exports = app
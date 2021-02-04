const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')

app.use(cors())
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]')) 

const todoRouter = require('./todoRouter')
app.use('/api/todos', todoRouter)

module.exports = app

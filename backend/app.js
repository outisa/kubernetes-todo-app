const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const todoRouter = require('./todoRouter')
app.use('/api/todos', todoRouter)

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/build/index.html`, (err) => {
      if (err) {
          res.status(500).send(err)
      }
  })
})

module.exports = app
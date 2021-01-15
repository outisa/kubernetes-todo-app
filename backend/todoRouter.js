const todoRouter = require('express').Router()

todoRouter.get('/', async (request, response) => {
  response.json({ message: 'ToDos are on their way' })
})

module.exports = todoRouter
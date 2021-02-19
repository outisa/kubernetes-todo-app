const todoRouter = require('express').Router()
const axios = require('axios')
const NATS = require('nats')
const nc  = NATS.connect(process.env.NATS_URL)
const { createTables, getTodos, addTodo, getImage, addImage, updateImage, healthcheck, updateTodo, getTodo, deleteTodo} = require('./queries')

createTables()

const confirmConnection = async () => {
  const ready = await new Promise(resolve => {
    let subscription = nc.subscribe('broadcast_status', (msg) => {
      if (msg !== 'i_am') return
      resolve(subscription)
    })
    nc.publish('broadcast_status', 'anybody_there')
  })
  nc.unsubscribe(ready)
}

const isToday = (time) => {
  const timeStr = JSON.stringify(time)
  const day = timeStr.substring(9,11)
  const month = timeStr.substring(6,8)
  const year = timeStr.substring(1,5)
  if (parseInt(year) === new Date().getFullYear() && parseInt(month) === new Date().getMonth() + 1 &&  parseInt(day) === new Date().getDate()) {
    console.log(true)
    return true
  }
  return false
}

const getNewImage =  async () => {
  const response = await axios.get('https://picsum.photos/1200', { responseType: 'arraybuffer' })
  let image = await getImage()
  const date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
  if (image) {
    await updateImage(1, response.data, date)
    return await getImage()
  } else {
    const imageToSave= {
      dailyimage: response.data,
      timestamp: date
    }
    await addImage(imageToSave)
    return await getImage()
  }
}

todoRouter.get('/', async (request, response) => {
  const todoList = await getTodos()
  response.json(todoList)
})

todoRouter.post('/', async (request, response) => {
  if (request.body.todo.length > 140) {
    response.status(400).send({ error: 'Todo\'s maximum allowed length in 140' })
  } else {
    const todoToSave =  {
      todo: request.body.todo,
      done: false
    }
    savedTodo = await addTodo(todoToSave)
    await confirmConnection()
    nc.publish('saved_todo', JSON.stringify(savedTodo))
    response.json(savedTodo)
  }
})
todoRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  if (id) {
    const done = true
    await updateTodo(id, done)
    const updatedTodo = await getTodo(id)
    await confirmConnection()
    nc.publish('updated_todo', JSON.stringify(updatedTodo))
    response.json(updatedTodo)
  }
})
todoRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  if (id) {
    const todoToDelete = await getTodo(id)
    await deleteTodo(id)
    await confirmConnection()
    nc.publish('deleted_todo', JSON.stringify(todoToDelete))
    response.status(204).end()
  }
})

todoRouter.get('/image', async (request, response) => {
  let imageToSend = await getImage()
  if (!imageToSend){
    imageTosend = await getNewImage()
  } else {
    const time = imageToSend.timestamp
    if (!isToday(time)){
      imageTosend = await getNewImage()
    }
  }
  response.set('Content-type', 'application/json');
  return response.send(imageToSend.dailyimage)
})

todoRouter.get('/healthcheck', (request, response) => {
  healthcheck(request, response)
})
module.exports = todoRouter
const todoRouter = require('express').Router()
const axios = require('axios')

const { createTables, getTodos, addTodo, getImage, addImage, updateImage} = require('./queries')

createTables()

const isToday = (time) => {
  console.log(JSON.stringify(time))
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
  } else {
    const imageToSave= {
      dailyimage: response.data,
      timestamp: date
    }
    return await addImage(imageToSave)
  }
}

todoRouter.get('/', async (request, response) => {
  const todoList = await getTodos()
  console.log(todoList)
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
    response.json(savedTodo)
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
  response.send(imageToSend.dailyimage)
})

module.exports = todoRouter
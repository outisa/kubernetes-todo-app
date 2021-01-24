const todoRouter = require('express').Router()
const axios = require('axios')
const path = require('path')
const fs = require('fs')

const directory = path.join('/', 'app', 'backend', 'files')
const imagePath = path.join(directory, 'image.jpg')

const todoList = [
  {
    id: 1,
    todo: 'Clean your room'
  },
  {
    id: 2,
    todo: 'Make homeworks'
  },
  {
    id: 3,
    todo: 'Get kubernetes part 1 done!' 
  }
]

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
  const response = await axios.get('https://picsum.photos/1200', { responseType: 'stream' })
  return new Promise(resolve => {
    response.data.pipe(fs.createWriteStream(imagePath).on('finish', resolve)) 
  })
}
const getImage = async () => {
  return fs.readFileSync(imagePath, (err) => {
    if (err) console.log(err)
  }) 
}

todoRouter.get('/', async (request, response) => {
  response.json(todoList)
})

todoRouter.post('/', async (request, response) => {
  const todoToSave =  {
    todo: request.body.todo,
    id: todoList.length +1
  }
  todoList = todoList.concat(todoToSave)
  response.json(todoToSave)
})

todoRouter.get('/image', async (request, response) => {
  let imageToSend = ''
  if (!fs.existsSync(imagePath)){
    await getNewImage()
  } else {
    const stats = fs.statSync(imagePath)
    const time = stats.mtime
    if (!isToday(time)){
      fs.unlink(imagePath, (err) => console.log(err))
      await getNewImage()
    }
  }
  if (fs.existsSync(imagePath)) {
    imageToSend = await getImage()
  }
  console.log(imageToSend)
  response.set('Content-type', 'application/json');
  response.send(imageToSend)
})
module.exports = todoRouter
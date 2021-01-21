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
const getNewImage = async () => {
  const response = await axios.get('https://picsum.photos/1200', { responseType: 'stream' })
  await response.data.pipe(fs.createWriteStream(imagePath))
  if (fs.existsSync(imagePath)) {
    return fs.readFileSync(imagePath, (err) => {
      if (err) console.log(err)
    })
  }
  return null
}
const getImage = async () => {
  if (fs.existsSync(imagePath)) {
    const stats = fs.statSync(imagePath)
    const time = stats.mtime
    console.log(time)
    if (!isToday(time)){
      fs.unlink(imagePath, (err) => console.log(err))
      return await getNewImage()
    } else {
      return fs.readFileSync(imagePath, (err) => {
        if (err) console.log(err)
      })
    }
  } else {
    return await getNewImage()
  }
}

todoRouter.get('/', async (request, response) => {
  response.json(todoList)
})

todoRouter.get('/image', async (request, response) => {
  const imageToSend = await getImage()
  response.set('Content-type', 'application/json');
  response.send(imageToSend)
})
module.exports = todoRouter
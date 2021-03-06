const { Pool } = require('pg')
const password = process.env.POSTGRES_PASSWORD
const string = 'postgres://postgres:'+password+'@postgres-svc.todo-app:5432/postgres'
const connectionUrl = {connectionString: string }
const pool = new Pool(connectionUrl)

pool.on('connect', () => {
  console.log('connected to the db')
})
const createTables = async () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      todos(
        id SERIAL PRIMARY KEY,
        todo VARCHAR(140) NOT NULL,
        done BOOLEAN
      )`

  pool.query(queryText, (error, result) => {
    console.log(result)
    if (error) {
      console.log('error create table', error)
      throw error
    }
  })
  const queryText2 =
  `CREATE TABLE IF NOT EXISTS
    images(
      id SERIAL PRIMARY KEY,
      dailyImage BYTEA,
      timestamp DATE NOT NULL
    )`
  pool.query(queryText2, (error, result) => {
    console.log(result)
    if (error) {
      console.log('error create table images', error)
      throw error
    }
  })  
}

const healthcheck = (request, response) => {
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      return response.status(500).end()
    } else {
      console.log('res', res.data)
      return response.status(200).end()
    }
  }) 
}
const addTodo = async (todoToSave) => {
  const queryText = `INSERT INTO todos (todo, done) VALUES ($1, $2) RETURNING *`
  try {
    const results = await pool.query(queryText, [todoToSave.todo, todoToSave.done])
    return await results.rows[0]
  } catch (error) {
    console.log('error insert into table', error)
  }
}

const getTodos = async () => {
  const queryText = 'SELECT * FROM todos'
  try {
    const results = await pool.query(queryText)
    return results.rows
  } catch (error) {
    console.log(error)
  }
}
const updateTodo = async (id, done) => {
  const queryText = `UPDATE todos SET done = $1 WHERE id = $2`
  try {
    await pool.query(queryText, [done, id])
  } catch (error) {
    console.log('update row', error)
  }
}

const deleteTodo = async (id) => {
  const queryText = `DELETE FROM todos WHERE id = $1`
  try {
    await pool.query(queryText, [id])
  } catch (error) {
    console.log('update row', error)
  }
}

const getTodo = async (id) => {
  const queryText = 'SELECT * FROM todos WHERE id = $1'
  try {
    const results = await pool.query(queryText,[id])
    return results.rows[0]
  } catch (error) {
    console.log(error)
  }
}
const addImage = async (imageToSave) => {
  const queryText = `INSERT INTO images (dailyimage, timestamp) VALUES ($1, $2) RETURNING *`
  try {
    const results = await pool.query(queryText, [imageToSave.dailyimage, imageToSave.timestamp])
    return await results.rows[0]
  } catch (error) {
    console.log('error insert into table', error)
  }
}

const getImage = async () => {
  const queryText = 'SELECT * FROM images where id = 1'
  try {
    const results = await pool.query(queryText)
    return await results.rows[0]
  } catch (error) {
    console.log(error)
  }
}
const updateImage = async (id, dailyimage, timestamp) => {
  const queryText = `UPDATE images SET dailyimage = $1, timestamp = $2 WHERE id = $3`
  try {
    await pool.query(queryText, [dailyimage, timestamp, id])
  } catch (error) {
    console.log('update row', error)
  }
}
module.exports = {
  createTables,
  getTodos,
  addTodo,
  updateTodo,
  updateImage,
  getImage,
  addImage,
  healthcheck,
  getTodo,
  deleteTodo
}

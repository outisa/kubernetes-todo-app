const { Pool } = require('pg')
const password = process.env.POSTGRES_PASSWORD
const string = 'postgres://postgres:'+password+'@postgres-svc.default:5432/postgres'
const connectionUrl = {connectionString: string }
const pool = new Pool(connectionUrl)

pool.on('connect', () => {
  console.log('connected to the db')
})
const createTable = async () => {
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
}

const addTodo = async (todoToSave) => {
  const queryText = `INSERT INTO todos (todo, done) VALUES ($1, $2) RETURNING *`
  try {
    const results = await pool.query(queryText, [todoToSave.todo, todoToSave.done])
    return results.rows[0]
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
    const results = await pool.query(queryText, [done, id])
    return results.rows[0]
  } catch (error) {
    console.log('update row', error)
  }
}
module.exports = {
  createTable,
  getTodos,
  addTodo,
  updateTodo
}

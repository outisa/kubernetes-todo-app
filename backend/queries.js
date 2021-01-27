const { Pool } = require('pg')
const password = process.env.POSTGRES_PASSWORD
const string = 'postgres://postgres:'+password+'@postgres-svc.todoapp-namespace:5432/todos'
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

const addTodo = async (todo) => {
  const queryText = `INSERT INTO todos (todo) VALUES ($1)`
  try {
    const results = await pool.query(queryText, [todo])
    console.log(results.rows[0])
    return results.rows[0]

  } catch (error) {
    console.log('error insert into table', error)
  }
}

const getTodos = async () => {
  const queryText = 'SELECT * FROM todos WHERE id = 1'
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
    console.log(results.rows[0])
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
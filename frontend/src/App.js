import React, { useEffect, useState } from 'react'
import axios from 'axios';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [image, setImage] = useState('')
  const [newTodo, setTodo] = useState('')
  const baseUrl = '/api/todos';
  const getData = () => {
    axios
      .get(baseUrl)
      .then(response => {
        setTodos(response.data)
      })
  }
  const getImage = () => {
    axios
      .get(`${baseUrl}/image`, {responseType: 'blob'})
      .then(response => {
        console.log(response)
        setImage(URL.createObjectURL(response.data))
      })
  }
  useEffect(getData, [])
  useEffect(getImage, [])

  const styles = {
    padding: 20,
    margin: 50,
  }
  const handleChange = (event) => {
    const todo = event.target.value
    console.log(todo)
    setTodo(todo)
  }
  const addTodo = (event) => {
    event.preventDefault()
    console.log('button clicked')
    setTodo('')
  }
  return (
    <div style={styles}>
      <h2>Todo App - the way of listing todos</h2>
      {image ?
        <img src={image} alt='Random pic' width='400' height='400'/>
        : null
      }
      <form  onSubmit={addTodo}>
        <input value={newTodo} placeholder='Add a new todo' onChange={handleChange} maxLength='140'/>
        <button type='submit' >Send</button>
      </form>
      <ul>
        {todos ? todos.map((todo) => {
          return <li key={todo.id}>{todo.todo}</li>
        }) : null}
      </ul>
    </div>
  )
}

export default App

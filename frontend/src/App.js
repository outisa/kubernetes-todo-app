import React, { useEffect, useState } from 'react'
import axios from 'axios';

const App = () => {
  const [todos, setTodos] = useState({});
  const baseUrl = '/api/todos';
  const getData = () => {
    console.log('effect')
    axios
      .get(baseUrl)
      .then(response => {
        setTodos(response.data)
      })
  }
  useEffect(getData, [])

  return (
    <div>
      <h3>ToDos to do</h3>
      <p>Well, nothing there yet. But {todos.message}</p>
    </div>
  )
}

export default App

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Button, Icon, Table } from 'semantic-ui-react'

const App = () => {
  const [todos, setTodos] = useState([])
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
    setTodo(todo)
  }
  const addTodo = async (event) => {
    event.preventDefault()
    const todoToSave = {
      todo: newTodo
    }
    const addedTodo = await axios.post(baseUrl, todoToSave)
    setTodos(todos.concat(addedTodo.data))
    setTodo('')
  }

  const updateTodo = async (id) => {
    console.log('id', id)
    const todo = todos.filter(todo => todo.id===id)
    const todoToUpdate = {
      ...todo[0],
      done:  true
    }
    const updatedTodo = await axios.put(`${baseUrl}/${id}`, todoToUpdate)
    console.log(updatedTodo.data)
    setTodos(todos.map(todo => todo.id === id ? updatedTodo.data : todo))
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
        <Button primary type='submit' >Add todo</Button>
      </form>
      <h3>Your personal todolist</h3>
      <Table>
        {todos ? todos.map((todo) => {
          return (
            <tr key={todo.id}>
              <td>{todo.todo}</td>
              <td>{todo.done ? 
               <Icon color='green' name='checkmark'/>
              :
               <Button positive onClick={() => updateTodo(todo.id)}>Mark as done</Button>
              }
              </td>
            </tr>
        )})
        : null}
      </Table>
    </div>
  )
}

export default App

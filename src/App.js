import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const API_USERS_URL = 'https://jsonplaceholder.typicode.com/users'
  const API_ALBUMS_URL = 'https://jsonplaceholder.typicode.com/albums'

  const [users, setUsers] = useState([])

  const fetchData = async () => {
    const res = await fetch(API_USERS_URL)
    let data = await res.json()
    // figured it makes more sense to cull 3 random users than set random 7 
    for (let i = 0; i < 3; i++) {
      const random = Math.floor(Math.random() * (data.length - i)) // decrease max by number of iterations, so we don't get an index outside the new length of array 
      data.splice(random, 1)
    }
    setUsers(data)
  }

  useEffect(() => {
    fetchData()
  }, []) // empty dependency array allows useEffect to run only on component mount (mimic componentDidMount in class components)

  return (
    <div className="App">
      {users.map(user => (
        JSON.stringify(user)
      ))}
    </div>
  );
}

export default App;

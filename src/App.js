import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const BASE_URL = 'https://jsonplaceholder.typicode.com'


  const [users, setUsers] = useState([])
  const [albums, setAlbums] = useState([])
  const [photos, setPhotos] = useState([])

  const fetchData = async () => {
    try {
      const [userRes, albumRes, photoRes] = await Promise.all([fetch(`${BASE_URL}/users`), fetch(`${BASE_URL}/albums`), fetch(`${BASE_URL}/photos`)]) // ensure all promises are fulfilled before we manipulate data
      let userData = await userRes.json()
      let albumData = await albumRes.json()
      let photoData = await photoRes.json()
      setPhotos(photoData)
      // Randomize users:
      // figured it makes more sense to cull 3 random users than set random 7 
      for (let i = 0; i < 3; i++) {
        const random = Math.floor(Math.random() * (userData.length - i)) // decrease max by number of iterations, so we don't get an index outside the new length of array 
        userData.splice(random, 1)
      }
      setUsers(userData)
      // Albums:
      const userIDs = userData.map(user => user.id)
      const filteredAlbums = albumData.filter(album => userIDs.includes(album.userId))

      // Photos:
      const albumIDs = filteredAlbums.map(album => album.id)
      const filteredPhotos = photoData.filter(photo => albumIDs.includes(photo.albumId))
      console.log(filteredPhotos)

    } catch (error) {
      console.error(error)
    }
  }


  useEffect(() => {
    fetchData()
  }, []) // empty dependency array allows useEffect to run only on component mount (mimic componentDidMount in class components)

  return (
    <div className="App">
      hello    </div>
  );
}

export default App;

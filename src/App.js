import { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import Select from 'react-select';
import './App.css';

function App() {
  const BASE_URL = 'https://jsonplaceholder.typicode.com'

  const [data, setData] = useState([])
  const [keys, setKeys] = useState([])

  const fetchData = async () => {
    try {
      const [userRes, albumRes, photoRes] = await Promise.all([fetch(`${BASE_URL}/users`), fetch(`${BASE_URL}/albums`), fetch(`${BASE_URL}/photos`)])
      // ensure all promises are fulfilled before we manipulate data
      let [userData, albumData, photoData] = await Promise.all([userRes.json(), albumRes.json(), photoRes.json()])

      // Randomize users:
      // figured it makes more sense to cull 3 random users than set random 7 
      for (let i = 0; i < 3; i++) {
        const random = Math.floor(Math.random() * (userData.length - i)) // decrease max by number of iterations, so we don't get an index outside the new length of array 
        userData.splice(random, 1)
      }

      const consolidatedData = userData.map(user => {
        // create temp object with desired keys instead of deleting keys on user object
        const temp = {
          email: user.email,
          id: user.id,
        }
        // track album data to grab photos and increment correct photo count
        const userAlbums = {}

        albumData.forEach(album => {
          if (album.userId === temp.id) {
            temp[album.title] = 0
            userAlbums[album.id] = album.title
            setKeys(prev => [...prev, album.title])
          }

        })

        photoData.forEach(photo => {
          for (let key in userAlbums) {
            if (parseInt(key) === photo.albumId) temp[userAlbums[key]]++
          }
        })

        return temp
      })
      console.log(consolidatedData) // all users have 10 albums, all albums have 50 photos  
      setData(consolidatedData)



    } catch (error) {
      console.error(error)
    }
  }


  useEffect(() => {
    fetchData()
  }, []) // empty dependency array allows useEffect to run only on component mount (mimic componentDidMount in class components)

  const options = keys.map(key => {
    return { value: key, label: key }
  })

  const handleChange = e => {
    console.log(e)
    const temp = [...keys]
    const idx = temp.findIndex(key => key === e.value)
    console.log(idx)
    temp.splice(idx, 1)
    setKeys(temp)
  }

  return (
    <div className="App">
      <div className="container">
        <ResponsiveBar
          data={data}
          keys={keys}
          indexBy='email'
          margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
          padding={0.3}
        />
      </div>
      <Select options={options} onChange={handleChange} />
    </div>
  );
}

export default App;

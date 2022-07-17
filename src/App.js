import { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import Select from 'react-select';
import './App.css';

function App() {
  const BASE_URL = 'https://jsonplaceholder.typicode.com'

  const [data, setData] = useState([])
  const [keys, setKeys] = useState([])
  const [selected, setSelected] = useState([])

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
      setData(consolidatedData)



    } catch (error) {
      console.error(error)
    }
  }


  useEffect(() => {
    fetchData()
  }, []) // empty dependency array allows useEffect to run only on component mount (mimic componentDidMount in class components)

  const handleChange = e => {
    console.log(e)
    const difference = selected.filter(el => !e.includes(el)) // react select doesn't have a remove event, so we have to compare state with event 
    if (difference.length) {
      setKeys(prev => [...prev, difference[0].label]) // add key back into state
      const tempSelected = [...selected] // copy selected state to splice out 
      const idx = tempSelected.findIndex(el => el.label === difference[0].label)
      tempSelected.splice(idx, 1)
      setSelected(tempSelected)
      return
      // works but keys are not in the same order 
    }
    console.log(difference)

    const tempKeys = [...keys]
    const key = e[e.length - 1]

    const selectedAlbum = tempKeys.splice(key.value, 1)
    setSelected(prev => [...prev, key])
    setKeys(tempKeys)
    console.log(e.length, selected.length)
    // if (e.length === selected.length) console.log('same length')
  }

  return (
    <div className="App">
      <div className="container">
        <Select isMulti options={keys.map((key, idx) => ({ value: idx, label: key }))} onChange={handleChange} />
        <ResponsiveBar
          data={data}
          keys={keys}
          indexBy='email'
          margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
          padding={0.3}
        />
      </div>
    </div>
  );
}

export default App;

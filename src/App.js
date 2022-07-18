import { useState, useEffect } from 'react';
import './App.css';
import { BarGraph } from './components/BarGraph';
import { Top } from './components/Top'

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
          if (album.userId === temp.id) { // if album belongs to a user
            temp[album.title] = 0 // add album with initial photo count to user object
            userAlbums[album.id] = album.title // track all users albums away from email/id
            setKeys(prev => [...prev, album.title]) // add album name to keys for the bar chart
          }

        })

        photoData.forEach(photo => {
          for (let key in userAlbums) {
            if (parseInt(key) === photo.albumId) temp[userAlbums[key]]++
            // 
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
      difference.forEach((diff, i) => {
        setKeys(prev => [...prev, difference[i].label]) // add key back into state
        const tempSelected = [...selected] // copy selected state to splice out 
        const idx = tempSelected.findIndex(el => el.label === difference[i].label)
        tempSelected.splice(idx, 1)
        setSelected(tempSelected)
      })
      return
    }

    const tempKeys = [...keys]
    const key = e[e.length - 1]

    tempKeys.splice(key.value, 1)
    setSelected(prev => [...prev, key])
    setKeys(tempKeys)
  }

  return (
    <div className="App">
      <div className="title-wrapper">
        <h1>Demo Dash</h1>
      </div>
      <div class="container">
        <Top keys={keys} handleChange={handleChange} />
        <BarGraph data={data} keys={keys} />
      </div>
    </div>
  );
}

export default App;

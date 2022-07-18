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
            userAlbums[album.id] = album.title // track all users albums seperately from email/id
            setKeys(prev => [...prev, album.title]) // add album name to keys for the bar chart
          }

        })

        photoData.forEach(photo => {
          for (let key in userAlbums) {
            // increment photo count where album ID and photo.albumId match
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

  const handleChange = evt => {
    // check if change was a remove or clear event
    const tempKeys = [...keys]
    const tempSelected = [...selected]
    // clear out bug was due to temp variables being reinitialized each loop
    const difference = selected.filter(el => !evt.includes(el)) // react select doesn't have a remove event, so we have to compare state with event 
    if (difference.length) {

      difference.forEach(diff => {
        tempKeys.splice(diff.value, 0, diff.label) // splice in the returned key at original index
        const selectedIdx = tempSelected.findIndex(el => el.value === diff.value)
        tempSelected.splice(selectedIdx, 1) // splice removed filter out from selected state
      })

      setKeys(tempKeys)
      setSelected(tempSelected)
      return
    }
    // change wasn't a remove event - so filter out last album added to event object
    const filtered = evt[evt.length - 1] //
    tempKeys.splice(filtered.value, 1)
    setSelected(prev => [...prev, filtered])
    setKeys(tempKeys)
  }

  return (
    <div className="App">
      <div className="title-wrapper">
        <h1>Demo Dash</h1>
      </div>
      <div className="container">
        <Top keys={keys} handleChange={handleChange} />
        <BarGraph data={data} keys={keys} />
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  console.log(process.env.REACT_APP_SI_API_KEY)

  // Declare a new state variable, which we'll call "count"
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const URI = `https://api.si.edu/openaccess/api/v1.0/search?q=unit_code:NMAAHC&rows=100&api_key=${process.env.REACT_APP_SI_API_KEY}`

  const [num, setNum] = useState(0)
  const handleClick = () => {
    setNum(Math.round(Math.random() * 100))
    console.log(items[num])
  }

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch(URI)
      .then(res => res.json())
      .then(
        (result) => {
          const newRows = result.response.rows.filter( row => {
            if (row &&
              row.content
              && row.content.descriptiveNonRepeating
              && row.content.descriptiveNonRepeating.online_media
              && row.content.descriptiveNonRepeating.online_media.media) {
              return row
            }
          })
          setItems(newRows);
          setIsLoaded(true);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="App">

        <header className="App-header">
          <h1>NMAAHC Object Generator</h1>
        </header>
        <div>
          <p>{items[num].content.descriptiveNonRepeating.title.content}</p>
            <img src={items[num].content.descriptiveNonRepeating.online_media.media[0].thumbnail} alt='alt' width='400px' />
        </div>

        <input type="button" value="show an object" onClick={handleClick} />
      </div>
    );
  }


}

export default App;

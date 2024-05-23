import { useState, useEffect } from 'react';

import { TrackList } from './components/TrackList/TrackList';
import { Track } from './components/Track/Track';
import './App.css'
import mockData from './mockData/mockData';

function App() {
  const [inputVal, setInputVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (event) => {
    setInputVal(() => event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputVal.length > 0) {
      // Get search results 
      const searchResult = mockData.filter((data) => {
        return Object.keys(data).some(function (key) {
          if (key != "id") return data[key].includes(inputVal);
        });
      });
      setSearchResults(searchResult);
      setSearchQuery(inputVal);
      setInputVal("");
    }
  }

  useEffect(() => {
    // const searchResult = mockData.filter((data) => {
    //   return Object.keys(data).some(function (key) {
    //     if (key != "id") return data[key].includes(searchQuery);
    //   });
    // });
    // console.log(searchResult);
    // setSearchResults(searchResult);
    console.log(searchResults);
  }, [searchResults]);

  return (
    <>
      <h1>Jammming</h1>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Search songs' name='searchSongs' id='searchSongs' value={inputVal} onChange={handleChange} />
        <button type='submit'>Search</button>
      </form>

      {/* Display list of results */}
      <TrackList searchQuery={searchQuery} searchResults={searchResults}>
        {/* Display each track that is matching users search query */}
        <ul>
          {searchResults.map((searchResult, index) => (
            <Track key={index} searchResult={searchResult} />
          ))}
        </ul>
      </TrackList>
    </>
  )
}

export default App

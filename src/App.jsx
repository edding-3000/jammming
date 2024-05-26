import { useState, useEffect } from 'react';

import Playlist from './components/Playlist/Playlist';
import TrackList from './components/TrackList/TrackList';
import './App.css'
import mockData from './mockData/mockData';
import requestAccessToken from './spotifyAuthorization/requestAccessToken';
import { currentToken, extractAccessToken, getUserData } from './spotifyAuthorization/extractAccessToken';

function App() {
  const [inputVal, setInputVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [userData, setUserData] = useState({});
  const [loginError, setLoginError] = useState("");

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

  function addToPlaylist(trackId) {
    // Find track by id in searchresults array
    const trackIndex = searchResults.findIndex((searchResult) => searchResult.id === trackId);

    // If no Track with id found return
    if (trackIndex === -1) {
      console.error(`Track with id ${trackId} not found in searchResults.`);
      return;
    }

    // Check if track is already in playlist
    if (!playlistTracks.some((playlistTrack) => playlistTrack.id === searchResults[trackIndex].id)) {
      // If not, add track to playlist
      setPlaylistTracks((prev) => [searchResults[trackIndex], ...prev]);
    }
  }

  const handleTrackButtonClick = ({ target }) => {
    const trackId = target.getAttribute("data-id");
    const action = target.innerText;
    if (action === "Add") {
      addToPlaylist(trackId);
    }
    if (action === "Remove") {
      setPlaylistTracks((prev) => prev.filter((playlistTrack) => playlistTrack.id !== trackId));
    }
  }

  const connectToSpotify = async () => {
    await requestAccessToken();
  }

  useEffect(() => {
    const fetch = async () => {
      let access_token = null;
      if (!currentToken.access_token) access_token = await extractAccessToken();
      else access_token = currentToken.access_token;
      await getUserData(access_token).then(
        (data) => {
          setLoginError("");
          if (data) {
            setUserData(data);
            console.log(data);
          }
        }
      ).catch((error) => {
        console.log(error);
        setLoginError(error);
        setUserData({});
      })
    }

    if (window.location.hash.includes('access_token') || (Object.keys(userData).length === 0 && currentToken.access_token)) {
      fetch();
    }

    if (currentToken.timeLeft.isTimeLeft) {
      let handleExpiration = setTimeout(() => { handleLogout() }, currentToken.timeLeft.time)
      return () => { clearTimeout(handleExpiration) };
    };
    console.log(currentToken.timeLeft.time);
  }, []);

  function handleLogout() {
    console.log("Bei Spotify abgemeldet");
    localStorage.clear();
    setUserData({});
    window.location.href = "http://localhost:5173";
  }

  useEffect(() => {
    console.log(playlistTracks);
  }, [playlistTracks]);

  useEffect(() => {
    console.log(searchResults);
  }, [searchResults]);

  return (
    <>
      <h1>Jammming</h1>
      {Object.keys(userData).length === 0 ? "" : <p>Hallo {userData.display_name}</p>}
      <button onClick={connectToSpotify} className={Object.keys(userData).length === 0 ? "show" : "hide"}>Mit Spotify verbinden</button>
      <button onClick={handleLogout} className={Object.keys(userData).length === 0 ? "hide" : "show"}>Logout</button>
      <p>{loginError}</p>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Search songs' name='searchSongs' id='searchSongs' value={inputVal} onChange={handleChange} />
        <button type='submit'>Search</button>
      </form>

      {/* Display list of results */}
      <TrackList searchQuery={searchQuery} searchResults={searchResults} playlistTracks={playlistTracks} onTrackButtonClick={handleTrackButtonClick} />
      {/* Display playlist */}
      <Playlist playlistTracks={playlistTracks} onTrackButtonClick={handleTrackButtonClick} />
    </>
  )
}

export default App

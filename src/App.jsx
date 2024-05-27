/**
 * First React project
*/

import { useState, useEffect } from 'react';

// Components
import Playlist from './components/Playlist/Playlist';
import TrackList from './components/TrackList/TrackList';
import { SearchBar } from './components/SearchBar/SearchBar';
import './App.css'

// Spotify files
import requestAccessToken from './spotify/spotifyAuthorization/requestAccessToken';
import { currentToken, extractAccessToken, getUserData } from './spotify/spotifyAuthorization/extractAccessToken';
import { spotifySearchRequest } from './spotify/spotifySearchRequest';

// Helper
import { millisToMinutesAndSeconds } from './helper/helper';

function App() {
  const [inputVal, setInputVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [userData, setUserData] = useState({});
  const [loginError, setLoginError] = useState("");
  const [loginCountdown, setLoginCountdown] = useState("");
  const [logout, setLogout] = useState("");

  const handleChange = (event) => {
    setInputVal(() => event.target.value);
  }

  // Search for track
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputVal.length > 0) {
      // Get search results 
      let result = await spotifySearchRequest(inputVal);
      let searchResult = [];

      for (const item of result) {
        searchResult.push({
          "album": item.album.name,
          "release_date": item.album.release_date,
          "image": item.album.images[1].url,
          "artists": item.artists.map((artist) => artist.name).join(", "),
          "name": item.name,
          "duration": millisToMinutesAndSeconds(item.duration_ms),
          "uri": item.uri,
          "id": item.id
        });
      };
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

  // Add track to Playlist
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

  // Connect to Spotify via Implicit Grant Flow (Not recomended because of security flaws)
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
      // Display timer for token expiry
      const intervalId = setInterval(() => {
        setLoginCountdown(millisToMinutesAndSeconds(currentToken.timeLeft.time));
      }, 1000);

      // Handle Logout after Token expires
      const handleExpiration = setTimeout(() => { handleLogout() }, currentToken.timeLeft.time)

      return () => {
        clearTimeout(handleExpiration);
        clearInterval(intervalId);
      };
    };
  }, []);

  function handleLogout() {
    console.log("Bei Spotify abgemeldet");
    localStorage.clear();
    setUserData({});
    setLogout("Du wurdest abgemeldet.");
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
      <p>{loginError}</p>
      <p>{logout}</p>
      <button onClick={connectToSpotify} className={Object.keys(userData).length === 0 ? "show" : "hide"}>Mit Spotify verbinden</button>

      <div className={Object.keys(userData).length === 0 ? "hide" : "show"}>
        <p>Hallo {userData.display_name}</p><p>{loginCountdown}</p>
        <button onClick={handleLogout}>Logout</button>
        <SearchBar handleSubmit={handleSubmit} inputVal={inputVal} handleChange={handleChange} />

        <TrackList searchQuery={searchQuery} searchResults={searchResults} playlistTracks={playlistTracks} onTrackButtonClick={handleTrackButtonClick} />

        <Playlist playlistTracks={playlistTracks} onTrackButtonClick={handleTrackButtonClick} />
      </div>
    </>
  )
}

export default App

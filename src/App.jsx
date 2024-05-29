/**
 * First React project
*/

import { useState, useEffect } from 'react';

// Components
import Playlist from './components/Playlist/Playlist';
import TrackList from './components/TrackList/TrackList';
import { SearchBar } from './components/SearchBar/SearchBar';
import { Nav } from './components/nav/nav';
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
  const [login, setLogin] = useState(false);
  const [connectClicked, setConnectClicked] = useState(false)

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
          "preview_url": item.preview_url,
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
    console.log("hi");
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
    const action = target.getAttribute("data-type");
    if (action === "add") {
      addToPlaylist(trackId);
    }
    if (action === "remove") {
      setPlaylistTracks((prev) => prev.filter((playlistTrack) => playlistTrack.id !== trackId));
    }
  }

  // Connect to Spotify via Implicit Grant Flow (Not recomended because of security flaws)
  const connectToSpotify = async () => {
    setConnectClicked(true);
    setTimeout(async () => { await requestAccessToken(); }, 200)
    // await requestAccessToken();
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
            setLogin(true);
            console.log(data);
          }
        }
      ).catch((error) => {
        console.log(error);
        setLoginError(error);
        setUserData({});
        setLogin(false)
      })
    }

    if (window.location.hash.includes('access_token') || (!login && currentToken.access_token)) {
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
    setConnectClicked(false);
  }, []);

  function handleLogout() {
    console.log("Bei Spotify abgemeldet");
    localStorage.clear();
    setUserData({});
    setLogin(false);
    setConnectClicked(false);
    // window.location.href = "http://localhost:5173";
  }

  useEffect(() => {
    console.log(playlistTracks);
  }, [playlistTracks]);

  useEffect(() => {
    console.log(searchResults);
  }, [searchResults]);

  return (
    <>
      {!login ? (
        <>
          <header>
            <Nav login={login} />
            <div className='hero'>
              <h2>Music your way – <br />Create your Spotify playlists online! 🎧</h2>
              <p className='intro'>After logging in, your session is valid for one hour. Afterwards you can log in again!</p>
              {`${loginError ? <p className="message error show">{loginError}</p> : ""}`}
            </div>
          </header >
          <div className='mainButtonWrap'>
            <button onClick={connectToSpotify} className={`mainButton connectButton${connectClicked ? " fullBlue" : ""}`}>Connect to Spotify →</button>
          </div>
          <p className='intro'>Jammmin is a website that allows users to search the Spotify library, create a custom playlist and then save it to their Spotify account.</p>
        </>
      ) : (
        <>
          <header className="logedIn">
            <Nav login={login} userData={userData} loginCountdown={loginCountdown} handleLogout={handleLogout} />
            <SearchBar className='hero' handleSubmit={handleSubmit} inputVal={inputVal} handleChange={handleChange} />
          </header>
          <main>
            <TrackList searchQuery={searchQuery} searchResults={searchResults} playlistTracks={playlistTracks} onTrackButtonClick={handleTrackButtonClick} />

            <Playlist playlistTracks={playlistTracks} onTrackButtonClick={handleTrackButtonClick} />
          </main>
        </>)
      }
    </>
  )
}

export default App

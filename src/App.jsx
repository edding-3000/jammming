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
import Spotify from './spotify/spotifyObject';

// Helper
import { millisToMinutesAndSeconds } from './helper/helper';
import { AudioProvider } from './hooks/AudioContext';

// Assets
import arrowRight from './assets/icons/arrow_forward_48dp_FILL0_wght400_GRAD0_opsz48.svg';

function App() {

  const [inputVal, setInputVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [userData, setUserData] = useState({});
  const [loginError, setLoginError] = useState("");
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
      let result = await Spotify.searchRequest(inputVal);
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
  const handleTrackButtonClick = ({ currentTarget }) => {
    const trackId = currentTarget.getAttribute("data-id");
    const action = currentTarget.getAttribute("data-type");
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
    setTimeout(async () => { Spotify.requestAccessToken(); }, 200);
  }

  useEffect(() => {
    const fetch = async () => {
      await Spotify.login().then(
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
        setLogin(false);
      });
    }

    if (window.location.hash.includes('access_token') || (!login && localStorage.getItem("access_token"))) { //Spotify.accessToken)) {
      fetch();
    }
    setConnectClicked(false);

    if (Spotify.timeTillLogout() === 0) {
      handleLogout();
    }
  }, []);

  useEffect(() => {
    if (Spotify.timeTillLogout() > 0) {
      const handleExpiration = setTimeout(() => { handleLogout() }, Spotify.timeTillLogout())

      return () => {
        clearTimeout(handleExpiration);
      };
    };
  }, [login])

  function handleLogout() {
    console.log("Bei Spotify abgemeldet");
    Spotify.logout();
    setUserData({});
    setLogin(false);
    setConnectClicked(false);
  }

  useEffect(() => {
    console.log(playlistTracks);
  }, [playlistTracks]);

  const showLoginError = loginError ? <p className="message error show">{loginError.message}</p> : "";
  return (
    <>
      {!login ? (
        <>
          <header>
            <Nav login={login} />
            <div className='hero'>
              <h2>Music your way – <br />Create your Spotify playlists online! 🎧</h2>
              <p className='intro'>After logging in, your session is valid for one hour. Afterwards you can log in again!</p>
              {showLoginError}
            </div>
          </header >
          <div className='mainButtonWrap'>
            <button onClick={connectToSpotify} className={`mainButton icon connectButton${connectClicked ? " fullBlue" : ""}`}>Connect to Spotify <img src={arrowRight} /></button>
          </div>
          <p className='intro'>Jammmin is a website that allows users to search the Spotify library, create a custom playlist and then save it to their Spotify account.</p>
        </>
      ) : (
        <>
          <header className="logedIn">
            <Nav login={login} userData={userData} handleLogout={handleLogout} />
            <SearchBar className='hero' handleSubmit={handleSubmit} inputVal={inputVal} handleChange={handleChange} />
          </header>
          <main>
            <AudioProvider>
              <TrackList
                searchQuery={searchQuery}
                searchResults={searchResults}
                playlistTracks={playlistTracks}
                onTrackButtonClick={handleTrackButtonClick}
              />

              <Playlist
                playlistTracks={playlistTracks}
                onTrackButtonClick={handleTrackButtonClick}
              >
                {/* <TitleIndex scrollContainerRef={scrollContainerRef} playlistTracks={playlistTracks} /> */}
              </Playlist>
            </AudioProvider>
          </main>
        </>)
      }
    </>
  )
}

export default App
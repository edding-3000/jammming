import React, { useState, useEffect } from 'react';
import Track from '../Track/Track';

function Playlist({ playlistTracks, onTrackButtonClick }) {
    const [playlistName, setPlaylistName] = useState("");
    const [playlistUris, setPlaylistUris] = useState([]);

    // Get playlistname from localstorage when app is loaded
    useEffect(() => {
        setPlaylistName(localStorage.getItem('playlistName') || "");
    }, []);

    // Add URI to playlistUris array when track is added to playlist
    useEffect(() => {
        setPlaylistUris(() => playlistTracks.map((playlistTrack) => (playlistTrack.uri)));
    }, [playlistTracks]);

    // Save playlist name to localstorage and to setter
    const handleChange = ({ target }) => {
        setPlaylistName(target.value);
        localStorage.setItem('playlistName', target.value);
    }

    // Handle "Add to Spotify click"
    const addToSpotify = () => {
        console.log(playlistUris);
    }

    return (
        <>
            <input type='text' placeholder='Playlistname' name='playlistInput' id='playlistInput' value={playlistName} onChange={handleChange} />
            <ul>
                {playlistTracks.map((playlistTrack, index) => (
                    <Track trackButtonEvent={onTrackButtonClick} key={index} trackInfos={playlistTrack} button="Remove" />
                ))}
            </ul>
            <button onClick={addToSpotify}>Add to Spotify</button>
        </>
    )
}
export default Playlist;
import React, { useState, useEffect } from 'react';
import Track from '../Track/Track';

import { userData, getUsersPlaylists, addPlaylist, addTracksToPlaylist } from '../../spotify/addPlaylist';

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
    const addToSpotify = async () => {
        console.log(playlistUris);
        if (playlistUris.length <= 0) {
            console.log("Keine tracks in der Playlist.");
            return;
        }

        if (!localStorage.getItem('access_token')) {
            console.log("Keine access_token.");
            return;
        }

        try {
            const userID = await userData("userID");
            let playlistID = await getUsersPlaylists(playlistName, userID);
            if (playlistID.length === 0) {
                playlistID = await addPlaylist(playlistName, userID);
            } else playlistID = playlistID[0].id;
            await addTracksToPlaylist(playlistUris, playlistID);
            console.log('Playlist erfolgreich erstellt und Tracks hinzugefügt');
        } catch (error) {
            console.error('Fehler beim Erstellen der Playlist oder Hinzufügen der Tracks:', error);
        }
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
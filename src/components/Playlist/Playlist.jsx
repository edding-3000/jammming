import React, { useState, useEffect } from 'react';
import './playlist.css';
import Track from '../Track/Track';

import { usersSpotifyData, getUsersPlaylists, addPlaylistToSpotify, tracksAlreadyInPlaylist, addTracksToPlaylist } from '../../spotify/addPlaylist';

function Playlist({ playlistTracks, onTrackButtonClick }) {
    const [playlistName, setPlaylistName] = useState("");
    const [playlistUris, setPlaylistUris] = useState([]);
    const [extendPlaylist, setExtendPlaylist] = useState(false);

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
    const addToSpotify = async (event) => {
        event.preventDefault();
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
            const userID = await usersSpotifyData("userID");
            let playlistID = await getUsersPlaylists(playlistName, userID);
            let tracks = playlistUris;
            if (playlistID.length === 0) {
                // If no playlist with same name was found, create new playlist
                playlistID = await addPlaylistToSpotify(playlistName, userID);
            } else {
                // Otherwise check if tracks are already in existing playlist
                playlistID = playlistID[0].id;
                tracks = await tracksAlreadyInPlaylist(playlistUris, playlistID);
            }
            await addTracksToPlaylist(tracks, playlistID);
            console.log('Playlist erfolgreich erstellt und Tracks hinzugefügt');
            setPlaylistUris([]);
        } catch (error) {
            console.error('Fehler beim Erstellen der Playlist oder Hinzufügen der Tracks:', error);
        }
    }

    const actionExtendPlaylist = ({ target }) => {
        const el = target.tagName.toLowerCase();
        if (el === 'ul' || el === 'button' || el === 'input' || el === 'img') { return; }

        let toggleClass;
        extendPlaylist ? toggleClass = false : toggleClass = true;
        setExtendPlaylist(toggleClass);
    }

    return (
        <div id="playList" className={`${extendPlaylist ? "extend " : ""}tracksContainer`} onClick={actionExtendPlaylist}>
            <form onSubmit={addToSpotify}>
                <input className='button' type='text' placeholder='Playlistname' name='playlistInput' id='playlistInput' value={playlistName} onChange={handleChange} />
                <div><button type='submit'>Add to Spotify</button></div>
            </form>
            <ul>
                {playlistTracks.map((playlistTrack, index) => (
                    <Track
                        trackButtonEvent={onTrackButtonClick}
                        key={index}
                        trackInfos={playlistTrack}
                        buttonType="remove"
                        button="-"
                    />
                ))}
            </ul>
        </div>
    )
}
export default Playlist;
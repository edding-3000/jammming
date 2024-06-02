import React, { useState, useEffect, useRef } from 'react';
import './playlist.css';
import Track from '../Track/Track';
import TitleIndex from './TitleIndex/TitleIndex';

import { useAudio } from '../../hooks/AudioContext';

import Spotify from '../../spotify/spotifyObject';

function Playlist({ playlistTracks, onTrackButtonClick, children }) {
    const { togglePlayPause, currentTrack, isPlaying } = useAudio();

    const [playlistName, setPlaylistName] = useState("");
    const [playlistUris, setPlaylistUris] = useState([]);
    const [extendPlaylist, setExtendPlaylist] = useState(false);

    const scrollContainerRef = useRef(null);

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
            console.log("No tracks in playlist.");
            return;
        }
        if (!playlistName) {
            console.log("Please enter a playlistname.");
            return;
        }
        await Spotify.createPlaylist(playlistUris, playlistName)
        setPlaylistUris([]);
    }

    const actionExtendPlaylist = ({ target }) => {
        const el = target.tagName.toLowerCase();
        if (el === 'ul' || el === 'button' || el === 'input' || el === 'img' || el === 'picture') { return; }

        let toggleClass;
        extendPlaylist ? toggleClass = false : toggleClass = true;
        setExtendPlaylist(toggleClass);
    }

    const playlistEmpty = playlistTracks.length === 0 ? "empty" : "";

    return (
        <div id="playList" className={`${extendPlaylist ? "extend " : ""}tracksContainer ${playlistEmpty}`} onClick={actionExtendPlaylist}>
            <form onSubmit={addToSpotify}>
                <input required className='button' type='text' placeholder='Playlistname' name='playlistInput' id='playlistInput' value={playlistName} onChange={handleChange} />
                <div><button type='submit' disabled={playlistTracks.length === 0 ? true : false}>Add to Spotify</button></div>
            </form>

            {/* {children} */}
            <TitleIndex scrollContainerRef={scrollContainerRef} playlistTracks={playlistTracks} />

            <ul ref={scrollContainerRef}>
                {playlistTracks.map((playlistTrack, index) => (
                    <Track
                        scrollClass="scroll-item"
                        trackButtonEvent={onTrackButtonClick}
                        key={index}
                        trackInfos={playlistTrack}
                        buttonType="remove"

                        togglePlayPause={togglePlayPause}
                        currentTrack={currentTrack}
                        isPlaying={isPlaying}
                    />
                ))}
            </ul>
        </div>
    );
}
export default Playlist;
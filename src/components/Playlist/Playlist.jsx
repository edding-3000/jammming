import React, { useState, useEffect } from 'react';
import Track from '../Track/Track';

function Playlist({ playlistTracks, onTrackButtonClick }) {
    const [playlistName, setPlaylistName] = useState("");


    useEffect(() => {
        setPlaylistName(localStorage.getItem('playlistName') || "");
    }, []);

    const handleChange = ({ target }) => {
        setPlaylistName(target.value);
        localStorage.setItem('playlistName', target.value);
    }

    return (
        <>
            <input type='text' placeholder='Playlistname' name='playlistInput' id='playlistInput' value={playlistName} onChange={handleChange} />
            <ul>
                {playlistTracks.map((playlistTrack, index) => (
                    <Track trackButtonEvent={onTrackButtonClick} key={index} trackInfos={playlistTrack} button="Remove" />
                ))}
            </ul>
        </>
    )
}
export default Playlist;
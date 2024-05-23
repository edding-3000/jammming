import React, { useState } from 'react';
import Track from '../Track/Track';

function TrackList({ searchQuery, searchResults, playlistTracks, onTrackButtonClick }) {
    const [isDisabled, setIsDisabled] = useState(false);

    return (
        <div>
            <h2>{searchResults.length === 0 ? "No r" : "R"}esults{searchQuery.length > 0 ? ` for "${searchQuery}"` : ""}</h2>
            <ul>
                {searchResults.map((searchResult, index) => (
                    <Track
                        trackButtonEvent={onTrackButtonClick}
                        key={index}
                        trackInfos={searchResult}
                        isDisabled={playlistTracks.some((playlistTrack) => playlistTrack.id === searchResult.id)}
                        button="Add"
                    />
                ))}
            </ul>
        </div>
    );
}

export default TrackList;
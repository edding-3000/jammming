import React, { useState } from 'react';
import Track from '../Track/Track';

function TrackList({ searchQuery, searchResults, playlistTracks, onTrackButtonClick }) {
    let resultsText;
    if (searchQuery.length > 0) {
        resultsText = searchResults.length === 0 ? "No r" : "R";
        resultsText += `esults for "${searchQuery}"`;
    }
    return (
        <div>
            {searchQuery.length > 0 && (<h2>{resultsText}</h2>)}
            <ul>
                {searchResults.map((searchResult, index) => (
                    <Track
                        trackButtonEvent={onTrackButtonClick}
                        key={index}
                        trackInfos={searchResult}
                        isDisabled={playlistTracks.some((playlistTrack) => playlistTrack.id === searchResult.id)}
                        buttonType="add"
                        button="+"
                    />
                ))}
            </ul>
        </div>
    );
}

export default TrackList; 
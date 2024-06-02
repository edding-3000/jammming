import React from 'react';
import './trackList.css';
import Track from '../Track/Track';
import { useAudio } from '../../hooks/AudioContext';

function TrackList({ searchQuery, searchResults, playlistTracks, onTrackButtonClick }) {
    const { togglePlayPause, currentTrack, isPlaying } = useAudio();

    let resultsText;
    if (searchQuery.length > 0) {
        resultsText = searchResults.length === 0 ? "No r" : "R";
        resultsText += `esults for "${searchQuery}"`;
    }

    return (
        <div id="trackList" className="tracksContainer">
            {searchQuery.length > 0 && (<h2>{resultsText}</h2>)}
            <ul>
                {searchResults.map((searchResult, index) => (
                    <Track
                        trackButtonEvent={onTrackButtonClick}
                        key={index}
                        trackInfos={searchResult}
                        isDisabled={playlistTracks.some((playlistTrack) => playlistTrack.id === searchResult.id)}
                        buttonType="add"

                        togglePlayPause={togglePlayPause}
                        currentTrack={currentTrack}
                        isPlaying={isPlaying}
                    />
                ))}
            </ul>
        </div>
    );
}

export default TrackList; 
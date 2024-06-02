import React, { createContext, useState, useContext } from 'react';

// Thank you ChatGPT

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackTimes, setTrackTimes] = useState({});

    const playTrack = (track) => {
        if (currentTrack && currentTrack !== track) {
            const currentTime = currentTrack.currentTime;
            setTrackTimes(prevTimes => ({
                ...prevTimes,
                [currentTrack.getAttribute('src')]: currentTime
            }));
            currentTrack.pause();
        }

        const savedTime = trackTimes[track.getAttribute('src')] || 0;
        track.currentTime = savedTime;
        track.volume = 0.5;
        track.play();
        setCurrentTrack(track);
        setIsPlaying(track.getAttribute('src'));
    };

    const pauseTrack = () => {
        if (currentTrack) {
            const currentTime = currentTrack.currentTime;
            setTrackTimes(prevTimes => ({
                ...prevTimes,
                [currentTrack.getAttribute('src')]: currentTime
            }));
            currentTrack.pause();
            setIsPlaying(false);
        }
    };

    const togglePlayPause = (track) => {
        if (currentTrack && currentTrack.getAttribute('src') === track.getAttribute('src')) {
            if (isPlaying) {
                pauseTrack();
            } else {
                playTrack(track);
            }
        } else {
            playTrack(track);
        }
    };

    return (
        <AudioContext.Provider value={{ togglePlayPause, currentTrack, isPlaying }}>
            {children}
        </AudioContext.Provider>
    );
};

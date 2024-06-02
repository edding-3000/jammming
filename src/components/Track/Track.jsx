import React, { useState, useEffect, useRef } from 'react';
import "./track.css";
import addIcon from '../../assets/icons/add_48dp_FILL0_wght100_GRAD0_opsz48.svg';
import removeIcon from '../../assets/icons/remove_48dp_FILL0_wght100_GRAD0_opsz48.svg';

function Track({
    scrollClass,
    trackButtonEvent,
    trackInfos,
    isDisabled,
    buttonType,
    togglePlayPause,
    currentTrack,
    isPlaying
}) {
    const refAudio = useRef(null);

    const addSvg = <img src={addIcon} alt="Add Icon" />;
    const removeSvg = <img src={removeIcon} alt="Remove Icon" />;
    let trackButton = isDisabled ?
        <button className="icon" onClick={trackButtonEvent} data-id={trackInfos.id} data-type="remove" data-uri={trackInfos.uri}>{removeSvg}</button>
        : <button className="icon" onClick={trackButtonEvent} data-id={trackInfos.id} data-type={buttonType} data-uri={trackInfos.uri} disabled={isDisabled}>{buttonType === "add" ? addSvg : removeSvg}</button>

    const handlePlayKlck = ({ target }) => {
        if (target.tagName.toLowerCase() === "picture") {
            togglePlayPause(refAudio.current);
        }
    }
    const [isPlayingHighlight, setIsPlayingHighlight] = useState(false);

    // Remove highlighting of treack when song ends
    useEffect(() => {
        let timeout;
        if (currentTrack === refAudio.current && isPlaying) {
            setIsPlayingHighlight(true);
            const audioDuration = Math.floor(refAudio.current.duration * 1000);
            const currentTimestamp = Math.floor(refAudio.current.currentTime * 1000);
            const timeLeft = audioDuration - currentTimestamp;
            timeout = setTimeout(() => {
                setIsPlayingHighlight(false);
            }, timeLeft);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [isPlaying, currentTrack])

    return (
        <li className={`${isDisabled ? "isAdded " : ""}${scrollClass ? scrollClass : ""}${isPlayingHighlight ? currentTrack === refAudio.current && isPlaying || isPlaying === refAudio.current.getAttribute("src") ? " currentlyPlaing" : "" : ""}`} onClick={handlePlayKlck}>
            <picture><img src={trackInfos.image} alt={`Cover ${trackInfos.name} - ${trackInfos.artists}`} /></picture>
            <span>
                <p className='semiBold'>{`${trackInfos.name} - ${trackInfos.artists}`}</p>
                <p className='greyFontCol'><a className='greyFontCol' href={trackInfos.albumLink} target='_blank' title={`${trackInfos.album} on Spotify`}>{trackInfos.album}</a></p>
                <p className='greyFontCol'>{trackInfos.duration}</p>
                <audio ref={refAudio} src={trackInfos.preview_url}></audio>
            </span>
            {trackButton}
        </li>
    );
}

export default Track;
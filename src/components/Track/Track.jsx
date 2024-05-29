import React from 'react';
import "./track.css";

function Track({
    trackButtonEvent,
    trackInfos,
    button,
    isDisabled,
    buttonType
}) {
    let trackButton = isDisabled ?
        <button className={`hi ${isDisabled ? "lol" : ""}`} onClick={trackButtonEvent} data-id={trackInfos.id} data-type="remove" data-uri={trackInfos.uri}>-</button>
        : <button className="hi" onClick={trackButtonEvent} data-id={trackInfos.id} data-type={buttonType} data-uri={trackInfos.uri} disabled={isDisabled}>{button}</button>

    return (
        <li className={isDisabled ? "isAdded" : ""}>
            <img src={trackInfos.image} alt={`Cover ${trackInfos.name} - ${trackInfos.artists}`} />
            <span>
                <p className='semiBold'>{`${trackInfos.name} - ${trackInfos.artists}`}</p>
                <p className='greyFontCol'>{trackInfos.album}</p>
                <p className='greyFontCol'>{trackInfos.duration}</p>
                {/* <audio controls controlsList="nofullscreen nodownload noremoteplayback noplaybackrate" src={trackInfos.preview_url}></audio> */}
            </span>
            {trackButton}
        </li>
    );
}

export default Track;
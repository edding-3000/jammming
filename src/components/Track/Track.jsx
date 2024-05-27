import React from 'react';

function Track({
    trackButtonEvent,
    trackInfos,
    button,
    isDisabled
}) {
    return (
        <li >
            <img src={trackInfos.image} alt={`Cover ${trackInfos.name} - ${trackInfos.artists}`} />
            <p>{`${trackInfos.name} - ${trackInfos.artists}`}</p>
            <p>{trackInfos.album}</p><p>{trackInfos.duration}</p>
            <button onClick={trackButtonEvent} data-id={trackInfos.id} data-uri={trackInfos.uri} disabled={isDisabled}>{button}</button>
        </li>
    );
}

export default Track;
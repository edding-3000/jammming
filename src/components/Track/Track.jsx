import React from 'react';

function Track({
    trackButtonEvent,
    trackInfos,
    button,
    isDisabled
}) {
    return (
        <li >
            <p>{`${trackInfos.name} - ${trackInfos.artist}`}</p>
            <p>{trackInfos.album}</p>
            <button onClick={trackButtonEvent} data-id={trackInfos.id} disabled={isDisabled}>{button}</button>
        </li>
    );
}

export default Track;
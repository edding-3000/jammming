import React from 'react';
import "./track.css";
import addIcon from '../../assets/icons/add_48dp_FILL0_wght100_GRAD0_opsz48.svg';
import removeIcon from '../../assets/icons/remove_48dp_FILL0_wght100_GRAD0_opsz48.svg';

function Track({
    trackButtonEvent,
    trackInfos,
    button,
    isDisabled,
    buttonType
}) {
    const addSvg = <img src={addIcon} alt="Add Icon" />;
    const removeSvg = <img src={removeIcon} alt="Remove Icon" />;
    let trackButton = isDisabled ?
        <button className="icon" onClick={trackButtonEvent} data-id={trackInfos.id} data-type="remove" data-uri={trackInfos.uri}>{removeSvg}</button>
        : <button className="icon" onClick={trackButtonEvent} data-id={trackInfos.id} data-type={buttonType} data-uri={trackInfos.uri} disabled={isDisabled}>{buttonType === "add" ? addSvg : removeSvg}</button>

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
import React, { useState, useEffect } from "react";
import { currentToken } from '../../spotify/spotifyAuthorization/extractAccessToken';
import { millisToMinutesAndSeconds } from '../../helper/helper';

import "./nav.css";

export function Nav({ login, userData, handleLogout }) {

    const [loginCountdown, setLoginCountdown] = useState("");

    useEffect(() => {
        if (currentToken.timeLeft.isTimeLeft) {
            //Display timer for token expiry
            const intervalId = setInterval(() => {
                setLoginCountdown(millisToMinutesAndSeconds(currentToken.timeLeft.time));
            }, 1000);

            return () => {
                clearInterval(intervalId);
            };
        };
    }, [login])

    const profilePic = login ? // If user is loggedin in Jammmin, render profile pic.
        userData.images.length === 0 // If no image is set in Spotify ...
            ? { 'data-letter': userData.display_name[0] } // ... render letter in profile pic
            : { style: { "--profileImg": `url(${userData.images[0].url})` } } // else render pic
        : "";

    return (
        <nav>
            {!login ? (
                <h1>Jammming</h1>
            ) : (
                <>
                    <p className="welcome" {...profilePic}>Hi, {userData.display_name}</p>
                    <h1>Jammming</h1>
                    <span>
                        <p>{loginCountdown}</p>
                        <button onClick={handleLogout}>Logout</button>
                    </span>
                </>
            )}
        </nav>
    );
}

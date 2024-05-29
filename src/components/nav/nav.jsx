import React from "react";
import "./nav.css";

export function Nav({ login, userData, loginCountdown, handleLogout }) {

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

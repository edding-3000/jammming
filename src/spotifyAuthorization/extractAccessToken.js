/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

const clearURL = () => {
    // Remove code from URL so we can refresh correctly.
    window.history.pushState({}, "", '/');

    const url = new URL(window.location.href);
    const updatedUrl = url.search ? url.href : url.href.replace('?', '');
    window.history.replaceState({}, document.title, updatedUrl);
}

// Data structure that manages the current active token, caching it in localStorage
export const currentToken = {
    get access_token() { return localStorage.getItem('access_token') || null; },
    get expires_in() { return localStorage.getItem('expires_in') || null },
    get setTime() { return localStorage.getItem('setTime') || null },
    get timeLeft() {
        let timeLeft = this.expires_in * 1000 - (Date.now() - this.setTime);
        timeLeft = timeLeft >= 0 ? timeLeft : 0;
        return { "time": timeLeft, "isTimeLeft": timeLeft === 0 ? false : true };
    },
    get expires() { return localStorage.getItem('expires') || null },

    save: function (response) {
        const { access_token, expires_in } = response;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('expires_in', expires_in);

        const now = new Date();
        const expiry = new Date(now.getTime() + (expires_in * 1000));
        localStorage.setItem('expires', expiry);

        localStorage.setItem('setTime', Date.now());
    }
};

export const extractAccessToken = async () => {
    const stateKey = 'spotify_auth_state';
    const params = getHashParams();

    let access_token = params.access_token,
        state = params.state,
        expires_in = params.expires_in,
        storedState = localStorage.getItem(stateKey);

    if (!access_token && currentToken.access_token) {
        access_token = currentToken.access_token;
    }
    // if (!state && currentToken.stateKey) {
    //     state = currentToken.stateKey;
    // }

    console.log("params", params);
    console.log("access_token", access_token);
    console.log("state", state);
    console.log("storedState", storedState);

    if (access_token && (state == null || state !== storedState)) {
        console.log('There was an error during the authentication');
        return;
    } else {
        if (!access_token) {
            // We're not logged in, so render the login template
            console.log("No access_token");
            return;
        }

        // Otherwise if we have a token, we're logged in, so fetch user data and render logged in template
        currentToken.save({ access_token, expires_in })

        localStorage.removeItem(stateKey);

        // Remove code from URL so we can refresh correctly.
        clearURL();

        return access_token;
    }
}

export const getUserData = async (access_token) => {
    try {
        const response = await fetch("https://api.spotify.com/v1/me", {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + access_token },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} Message: ${response.message}`);
        }

        const userData = await response.json();

        console.log("Bei Spotify angemeldet");
        return userData;
    } catch (error) {
        console.log(error);
        return null;
    }
}
import { currentToken } from "./spotifyAuthorization/extractAccessToken";

/**
 * Get Userid from spotify or localstorrage
 * @param {string} requestType When set to "userID" returns Spotify userId, otherwise object
 * @param {string} _access_token
 * @returns {Promise<(string|object)>}
 * 
 */
export const userData = async (requestType = "", _access_token = "") => {
    console.log("Looking for Userid.")
    let userID = localStorage.getItem("userID");

    // If userID is cached in localstorage, return it
    if (userID && requestType === "userID") {
        return userID;
    }

    let access_token = getAccessToken(_access_token);

    const endpoint = "me";

    // Otherwise get user data from Spotify
    const userData = await makeGet(endpoint, access_token);
    userID = userData.id;

    // Save UserID to localstorage, so we don't have to send to many requests to Spotify
    localStorage.setItem("userID", userID);

    if (requestType === "userID") {
        return userID;
    } else if (!requestType) {
        return userData;
    }
}

/** 
 * Search for an existing playlist with the same name on Spotify 
 * @returns {Promise<Array>}
*/
export const getUsersPlaylists = async (_playlistName = "", _userID = "", _access_token = "") => {
    console.log(`Searching for existing playlists.`);

    // If userID is not send with functioncall, try to get it from localstorage
    let userID = getUserID(_userID);

    let access_token = getAccessToken(_access_token);

    let playlistName = getPlaylistName(_playlistName);

    const endpoint = `users/${userID}/playlists`;

    console.log("Fetching users playlists from Spotify");
    const playlists = await makeGet(endpoint, access_token);

    if (playlists && playlists.total > 0) {
        let foundPlaylists = playlists.items.filter((item) => item.name === playlistName);
        console.log(foundPlaylists);
        if (foundPlaylists.length > 0) {
            console.log(`Found Playlist ${foundPlaylists[0].name} with ID ${foundPlaylists[0].id}.`);
        } else {
            console.log("No existing playlist with name " + playlistName + " found.");
        }
        return foundPlaylists;
    }
}

/** 
 * Add a new playlist to Spotify 
 * @returns {Promise<string>}
*/
export const addPlaylist = async (_playlistName = "", _userID = "", playlistDescription = "New playlist description", playlistPrivacy = false, _access_token) => {
    console.log(`Creating new playlist: ${_playlistName}.`);

    // If userID is not send with functioncall, try to get it from localstorage
    let userID = getUserID(_userID);

    // Check for playlistname
    let playlistName = getPlaylistName(_playlistName);

    let access_token = getAccessToken(_access_token)

    const body = {
        "name": playlistName,
        "description": playlistDescription,
        "public": playlistPrivacy
    }

    console.log("Sending data to Spotify.");

    const endpoint = `users/${userID}/playlists`;
    const playlistData = await makePost(endpoint, access_token, body);

    console.log(`Playlist ${playlistData.name} created.`);
    console.log(`PlaylistId: ${playlistData.id}.`);

    localStorage.setItem("playlistId", playlistData.id);

    return playlistData.id;
}

/**
 * Check if tracks of Jammmin playlist are already in existing Spotify playlist
 * @returns {Promise<Array>} Array of track uris, that aren't already in Spotify playlist
 */
export const tracksAlreadyInPlaylist = async (tracks, _playlistID, _access_token = "") => {
    console.log(`Check whether tracks are already in the playlist.`);

    let playlistID = getPlaylistId(_playlistID);

    if (tracks.length === 0) {
        throw new Error("No tracks in Jammming playlist.");
    }

    let access_token = getAccessToken(_access_token);

    const endpoint = `playlists/${playlistID}/tracks?fields=items%28track%28name%2Cid%2Curi%29%29`;

    console.log("Fetching tracks from existing playlist from Spotify");
    const playlistData = await makeGet(endpoint, access_token);

    if (playlistData) {
        let uniqueTracks = tracks.filter(track =>
            !playlistData.items.some(item => item.track.uri === track)
        );

        console.log(uniqueTracks);
        if (uniqueTracks.length > 0) {
            console.log(`Found ${tracks.length - uniqueTracks.length} that is/are already in the playlist.`);
        } else {
            console.log("All Tracks added.")
        }
        return uniqueTracks;
    }
}

/** 
 * Add tracks to Spotify playlist
 * @param {array} tracks Array with URIs of tracks
 * @param {string} _playlistID
 * @param {string} _access_token
 * @returns {Promise<object>}
 */
export const addTracksToPlaylist = async (tracks, _playlistID, _access_token = "") => {
    console.log(`Tracks will be added.`);

    let playlistID = getPlaylistId(_playlistID);

    if (tracks.length === 0) {
        throw new Error("No tracks in playlist.");
    }

    let access_token = getAccessToken(_access_token)

    const body = {
        "uris": tracks,
        "position": 0
    };

    const endpoint = `playlists/${playlistID}/tracks`;

    console.log("Fetching Data from Spotify");
    return await makePost(endpoint, access_token, body);
}

// HELPER FUNCTIONS

/**
 * 
 * Make a post request to Spotify
 * @param {string} endpoint
 * @param {string} access_token
 * @param {object} body
 * @returns {Promise<object>} Response of Spotify Api call
 * 
 */
const makePost = async (endpoint, access_token, body) => {
    try {
        const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + access_token,
                "Content-Type": "application / json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} Message: ${response.message}`);
        }

        const data = await response.json();
        return data
    } catch (error) {
        throw new Error(error);
    }
}

/** 
 * 
 * Make a get request to Spotify
 * @param {string} endpoint
 * @param {string} access_token
 * @returns {Promise<object>} Response of Spotify Api call
 * 
 */

const makeGet = async (endpoint, access_token) => {
    try {
        const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + access_token },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} Message: ${response.message}`);
        }

        const data = await response.json();

        return data;

    } catch (error) {
        throw new Error(error);
    }
}

const getAccessToken = (access_token) => {
    if (access_token) {
        return access_token
    }
    if (!access_token && currentToken.access_token) {
        return currentToken.access_token
    }
    if (!access_token && !currentToken.access_token) {
        throw new Error("No access_token");
    }
}

const getUserID = (userID) => {
    if (userID) {
        return userID;
    }
    let storedUserId = localStorage.getItem("userID");
    if (!userID && storedUserId) {
        return storedUserId;
    }
    if (!userID && !storedUserId) {
        throw new Error("No Spotify user id.");
    }
}

const getPlaylistName = (playlistName) => {
    if (playlistName) return playlistName;
    let storedPlaylistName = localStorage.getItem("playlistName");
    if (!playlistName && storedPlaylistName) {
        return storedPlaylistName;
    }
    if (!playlistName && !storedPlaylistName) {
        throw new Error("No Playlistname.");
    }
}

const getPlaylistId = (playlistID) => {
    if (playlistID) return playlistID;
    let storedPlaylistID = localStorage.getItem("playlistId");
    if (!playlistID && storedPlaylistID) {
        return storedPlaylistID;
    }
    if (!playlistID && !storedPlaylistID) {
        throw new Error("No playlist ID.");
    }
}
import { currentToken } from "./spotifyAuthorization/extractAccessToken";

/**
 * 
 * @param {"userID"} requestType 
 * @param {"_access_token"} 
 * @returns Users Spotify Id
 * 
 */

export const userData = async (requestType = "", _access_token = "") => {

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

export const addPlaylist = async (_playlistName = "", _userID = "", playlistDescription = "New playlist description", playlistPrivacy = false, _access_token) => {
    console.log(`Erstelle Playlist: ${_playlistName}.`);

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

    console.log("Fetching data.");

    const endpoint = `users/${userID}/playlists`;
    const playlistData = await makePost(endpoint, access_token, body);

    console.log(`Playlist ${playlistData.name} erstellt.`);
    console.log(`PlaylistId: ${playlistData.id}.`);

    localStorage.setItem("playlistId", playlistData.id);

    return playlistData.id;
}

export const getUsersPlaylists = async (_playlistName = "", _userID = "", _access_token = "") => {
    console.log(`Searching for existing playlists.`);

    // If userID is not send with functioncall, try to get it from localstorage
    let userID = getUserID(_userID);

    let access_token = getAccessToken(_access_token);

    let playlistName = getPlaylistName(_playlistName);

    const endpoint = `users/${userID}/playlists`;

    console.log("Fetching Data from Spotify");
    const playlists = await makeGet(endpoint, access_token);

    if (playlists && playlists.total > 0) {
        let foundPlaylists = playlists.items.filter((item) => item.name === playlistName);
        console.log(foundPlaylists);
        if (foundPlaylists.length > 0) {
            console.log(`Found Playlist ${foundPlaylists[0].name} with ID ${foundPlaylists[0].id}.`);
        } else {
            console.log("No existing playlist with name " + playlistName + " found.")
        }
        return foundPlaylists;
    }
}

export const addTracksToPlaylist = async (tracks, _playlistID, _access_token) => {
    console.log(`Tracks werden hinzugefügt.`);

    let playlistID = _playlistID;
    let storedPlaylistID = localStorage.getItem("playlistId");
    if (!playlistID && storedPlaylistID) {
        playlistID = storedPlaylistID;
    } else if (!playlistID && !storedPlaylistID) {
        throw new Error("No playlist ID.");
    }

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
import { getHashParams, clearURL, generateRandomString } from "./spotifyAuthorization/spotifyHelper";

/**
 * 
 * https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow
 * The implicit grant flow has some significant security flaws, so we strongly advise against using this flow. 
 * If you need to implement authorization where storing your client secret is not possible, use Authorization code with PKCE instead.
 * 
 */

const Spotify = {
    _userID: null,
    _accessToken: null,
    _expiresIn: null,
    _setTime: null,

    _timeout: null,
    _accessTokenRequested: false,

    _clientId: import.meta.env.VITE_client_id,
    _redirectUri: 'http://localhost:5173',

    set userID(userID) {
        if (!userID) return "No userID send.";
        this._userID = userID
        localStorage.setItem("userID", userID);
    },

    set accessToken(accessToken) {
        if (!accessToken) return "No AccessToken send.";
        this._accessToken = accessToken;
        localStorage.setItem("access_token", accessToken);
        localStorage.removeItem("accessTokenRequested");
    },

    set expiresIn(expiresIn) {
        if (!expiresIn) return;
        this._expiresIn = expiresIn;
        localStorage.setItem("expiresIn", expiresIn);

        const now = new Date();
        const expiry = new Date(now.getTime() + (expiresIn * 1000));
        localStorage.setItem("expires", expiry);

        const time = Date.now();
        localStorage.setItem("setTime", time);
        this.setTime = time;
    },

    set setTime(time) {
        if (time) this._setTime = time;
    },

    get userID() {
        if (this._userID) {
            return this._userID;
        }
        const storedUserId = localStorage.getItem("userID");
        if (storedUserId) {
            this._userID = storedUserId;
            return storedUserId;
        }
        throw new Error("No userID");
    },

    get accessToken() {
        if (this._accessToken) return this._accessToken;
        const storedAccessToken = localStorage.getItem("access_token");
        if (storedAccessToken) {
            this._accessToken = storedAccessToken;
            return storedAccessToken;
        }

        if (!localStorage.getItem("accessTokenRequested") || !localStorage.getItem('spotify_auth_state')) {
            console.log("??");
            localStorage.setItem("accessTokenRequested", true);
            this.requestAccessToken();
        }
        return null;
    },

    get expiresIn() {
        if (this._expiresIn) return this._expiresIn;
        const storedExpiresIn = localStorage.getItem("expiresIn");
        if (storedExpiresIn) {
            this._expiresIn = storedExpiresIn;
            return storedExpiresIn;
        }
        throw new Error("No expiresIn value");
    },

    get setTime() {
        if (this._setTime) return this._setTime;
        const storedSetTime = localStorage.getItem("setTime");
        if (storedSetTime) {
            this._setTime = storedSetTime;
            return storedSetTime;
        }
    },

    timeTillLogout() {
        if (!this.setTime || !this.expiresIn) { return; }
        const setTime = this.setTime;
        let timeLeft = this.expiresIn * 1000 - (Date.now() - setTime);
        timeLeft = timeLeft >= 0 ? timeLeft : 0;
        return timeLeft;
    },

    // Login Part

    async login() {
        if (this.extractAccessToken())
            return await this.getUserData();
        else
            throw new Error("Login failed.");
    },

    logout() {
        localStorage.clear();
        this._userID = null;
        this._accessToken = null;
        localStorage.removeItem("accessTokenRequested");
        this._expiresIn = null;
        this._setTime = null;
        if (this._timeout) clearTimeout(this._timeout);
        this._timeout = null;
    },

    timeoutLogout() {
        const time = this.timeTillLogout();
        this._timeout = window.setTimeout(() => this.logout(), time);
    },

    requestAccessToken() {
        if (this._accessToken) {
            return this._accessToken;
        }

        const state = generateRandomString(64);

        localStorage.setItem('spotify_auth_state', state);
        const scope = "playlist-read-private playlist-modify-private playlist-modify-public";

        let url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(this._clientId);
        url += '&scope=' + encodeURIComponent(scope);
        url += '&redirect_uri=' + encodeURIComponent(this._redirectUri);
        url += '&state=' + encodeURIComponent(state);

        window.location = url;
    },

    extractAccessToken() {
        if (this._accessToken) {
            return this._accessToken;
        } else if (!this._accessToken) {
            const storedAccessToken = localStorage.getItem("access_token");
            if (storedAccessToken) {
                this.accessToken = storedAccessToken;
                return storedAccessToken;
            }
        }

        console.log("Extracting Accesstoken from URL.");

        const params = getHashParams();

        let access_token = params.access_token,
            state = params.state,
            expires_in = params.expires_in,
            storedState = localStorage.getItem('spotify_auth_state');

        console.log("params", params);
        console.log("access_token", access_token);
        console.log("state", state);
        console.log("storedState", storedState);

        localStorage.removeItem('spotify_auth_state');
        clearURL();

        if (access_token && (state == null || state !== storedState)) {
            // localStorage.removeItem('spotify_auth_state');
            throw new Error('There was an error during the authentication: No state key or missmatching state keys.');
        }

        if (!access_token) {
            // We're not logged in
            console.log("No access_token");
            return;
        }

        this.accessToken = access_token;
        this.expiresIn = expires_in;
        if (this._timeout) clearTimeout(this._timeout);
        this.timeoutLogout(expires_in);

        return access_token;
    },

    async getUserData() {
        console.log("Fetching Userdata from Spotify.");

        const userData = await this.makeGet("me", this.accessToken);

        console.log("Bei Spotify angemeldet");
        return userData;
    },

    // Search part

    async searchRequest(searchQuery) {
        localStorage.setItem("searchQuery", searchQuery);

        const accessToken = this.accessToken;

        searchQuery = encodeURIComponent(searchQuery);
        try {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=10`, {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + accessToken },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} Message: ${response.message}`);
            }

            const track = await response.json();

            console.log(track.tracks.items);
            localStorage.removeItem("searchQuery");
            return track.tracks.items;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    // Add Playlist

    async userData(requestType = "") {
        console.log("Looking for Userid.")

        let userID = this._userID;

        if (userID && requestType === "userID") {
            return userID;
        }

        const accessToken = this.accessToken;

        const endpoint = "me";

        const userData = await this.makeGet(endpoint, accessToken);
        userID = userData.id;

        this.userID = userID;

        if (requestType === "userID") {
            return userID;
        } else if (!requestType) {
            return userData;
        } else return;
    },

    async getUsersPlaylists(_userID) {
        console.log(`Searching for existing playlists.`);

        let userID = _userID ? _userID : this.userID;

        const endpoint = `users/${userID}/playlists`;

        console.log("Fetching users playlists from Spotify");
        const playlists = await this.makeGet(endpoint, this.accessToken);

        if (playlists && playlists.total > 0) {
            return playlists;
        } else return;
    },

    checkIfPlaylistExists(usersPlaylists, playlistName) {
        if (usersPlaylists.length === 0) throw new Error("No playlist send with 'checkIfPlaylistExists' functioncall.");
        if (!playlistName) throw new Error("No playlist name.");

        const foundPlaylists = usersPlaylists.items.filter((item) => item.name === playlistName);
        console.log(foundPlaylists);
        if (foundPlaylists.length > 0) {
            console.log(`Found Playlist ${foundPlaylists[0].name} with ID ${foundPlaylists[0].id}.`);
            return foundPlaylists[0].id;
        } else {
            console.log("No existing playlist with name " + playlistName + " found.");
            return null;
        }
    },

    async addPlaylistToSpotify(_playlistName, playlistDescription = "New playlist description", playlistPrivacy = false) {
        if (!_playlistName) throw new Error("No playlist name in addPlaylistToSpotify function.");

        const playlistName = _playlistName;
        console.log(`Creating new playlist: ${playlistName}.`);

        const body = {
            "name": playlistName,
            "description": playlistDescription,
            "public": playlistPrivacy
        }

        console.log("Sending data to Spotify.");

        const endpoint = `users/${this.userID}/playlists`;
        const playlistData = await this.makePost(endpoint, this.accessToken, body);

        console.log(`Playlist ${playlistData.name} created.`);
        console.log(`PlaylistId: ${playlistData.id}.`);

        return playlistData.id;
    },

    async tracksAlreadyInPlaylist(tracks, playlistId) {
        console.log(`Check whether tracks are already in the playlist.`);

        if (tracks.length === 0) throw new Error("No tracks in Jammming playlist.");
        if (!playlistId) throw new Error("No playlist Id.");

        const endpoint = `playlists/${playlistId}/tracks?fields=items%28track%28name%2Cid%2Curi%29%29`;

        console.log("Fetching tracks from existing playlist from Spotify");
        const playlistData = await this.makeGet(endpoint, this.accessToken);

        if (playlistData) {
            // Check if Track from jammmin playlist is already in Spotify playlist
            let uniqueTracks = tracks.filter(track =>
                !playlistData.items.some(item => item.track.uri === track)
            );

            uniqueTracks.length > 0 ? console.log(`Found ${tracks.length - uniqueTracks.length} songs that is/are already in the playlist.`) : console.log("All Tracks added.");
            return uniqueTracks;
        }
    },

    async addTracksToPlaylist(tracks, playlistId) {
        console.log(`Tracks will be added.`);

        if (tracks.length === 0) throw new Error("No tracks in playlist.");
        if (!playlistId) throw new Error("No playlist Id.");

        const body = {
            "uris": tracks,
            "position": 0
        };

        const endpoint = `playlists/${playlistId}/tracks`;

        console.log("Fetching Data from Spotify");
        return await this.makePost(endpoint, this.accessToken, body);
    },

    // Actions

    async createPlaylist(tracks, playlistName) {
        if (!tracks) throw new Error("No tracks send to 'createPlaylist'.");
        if (!playlistName) throw new Error("No playlist name send to 'createPlaylist'.");

        try {
            const userID = await this.userData("userID");
            const usersPlaylists = await this.getUsersPlaylists(userID)
            let playlistID = this.checkIfPlaylistExists(usersPlaylists, playlistName);
            if (!playlistID) {
                playlistID = await this.addPlaylistToSpotify(playlistName); // description, privacy
            } else {
                tracks = await this.tracksAlreadyInPlaylist(tracks, playlistID);
            }
            await this.addTracksToPlaylist(tracks, playlistID);
            console.log('Playlist erfolgreich erstellt und Tracks hinzugefügt');
            return true;
        } catch (e) {
            console.error('Fehler beim Erstellen der Playlist oder Hinzufügen der Tracks:', e);
            return false;
        }
    },

    // Helper functions

    async makePost(endpoint, access_token, body) {
        try {
            const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} Message: ${response.message}`);
            }

            const data = await response.json();
            return data
        } catch (error) {
            console.error('Error in makePost:', error);
            throw new Error(error);
        }
    },

    async makeGet(endpoint, access_token) {
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
            console.error('Error in makeGet:', error);
            throw new Error(error);
        }
    }
};

export default Spotify;
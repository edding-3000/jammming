/**
 * 
 * https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow
 * The implicit grant flow has some significant security flaws, so we strongly advise against using this flow. 
 * If you need to implement authorization where storing your client secret is not possible, use Authorization code with PKCE instead.
 * 
 */

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// Authorization request
const requestAccessToken = async () => {
    const client_id = 'a99907a618d7462db34f0730ae960081';
    const redirect_uri = 'http://localhost:5173';

    const stateKey = 'spotify_auth_state';
    const state = generateRandomString(64);

    localStorage.setItem(stateKey, state);
    const scope = "playlist-read-private playlist-modify-private playlist-modify-public";

    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(state);

    window.location = url;
}

export default requestAccessToken;
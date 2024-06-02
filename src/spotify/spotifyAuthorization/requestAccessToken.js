/**
 * 
 * https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow
 * The implicit grant flow has some significant security flaws, so we strongly advise against using this flow. 
 * If you need to implement authorization where storing your client secret is not possible, use Authorization code with PKCE instead.
 * 
 */

export const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}
/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
export function getHashParams() {
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

export const clearURL = () => {
    // Remove code from URL so we can refresh correctly.
    window.history.pushState({}, "", '/');

    const url = new URL(window.location.href);
    const updatedUrl = url.search ? url.href : url.href.replace('?', '');
    window.history.replaceState({}, document.title, updatedUrl);
}
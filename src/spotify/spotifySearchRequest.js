import { currentToken } from "./spotifyAuthorization/extractAccessToken";

export const spotifySearchRequest = async (searchQuery) => {
    if (!currentToken.timeLeft.isTimeLeft) {
        console.log("Token abgelaufen.");
        return;
    }
    searchQuery = encodeURIComponent(searchQuery);
    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=10`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} Message: ${response.message}`);
        }

        const track = await response.json();

        console.log(track.tracks.items);
        return track.tracks.items;
    } catch (error) {
        console.log(error);
        return null;
    }
}
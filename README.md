# Jammming[^1]

First React project.
A website that allows users to search the Spotify library, create a custom playlist, then save it to their Spotify account.

> [!NOTE]
> Work in progress

>[!WARNING]
> This project uses Spotifys "Implicit Grant Flow". The implicit grant flow has some significant security flaws, so Spotify strongly advise against using this flow. If you need to implement authorization where storing your client secret is not possible, use Authorization code with PKCE instead.

## Features:

- Users can search for songs by song title.
- Users can see information about each song like title, artist, and album for songs they queried
- Users can export their custom playlist to their personal Spotify account

## Build with

This Project is build with React and Vite. It uses the Spotify "Implicit Grant Flow" api. 

[^1]: Based on a Codecademy tutorial

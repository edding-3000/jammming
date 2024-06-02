# Jammming :headphones:[^1]

**First React project** :partying_face:

Jammmin is a website that allows users to search the Spotify library, create a custom playlist, then save it to their Spotify account.

This project is the first result of a Codecademy Full-Stack course. Only the basic structure for the project was given, but not the code or the design itself. 

On the one hand, I focussed on the interface in this project (with a special focus on the mobile interface) and tried to create the best possible user experience. On the other hand, I deepened my knowledge of React and JavaScript.

## Features:

- Users can search for songs by song title.
- Users can see information about each song like title, artist, and album for songs they queried
- Users can listen to song teasers
- Users can export their custom playlist to their personal Spotify account

**Additional features:** 

The programme checks whether there is already a playlist with the same name and which songs are in it. If necessary, only the songs that are new are added to the playlist. 

**Future feature:** 

- Before the process described above is carried out, the user is asked via a dialogue box whether they would like to add the songs to the existing playlist.
- Hide navigation on scroll-down and show it on scroll-up

## How to use

If you would like to take a look at the project, you can download it here. 
In order for the project to run, you must insert your own [Spotify client ID](https://developer.spotify.com/documentation/web-api/tutorials/getting-started#create-an-app) in the file "Spotify > spotifyObject.js". Here is how you do it: [Spotify - Create an app](https://developer.spotify.com/documentation/web-api/tutorials/getting-started#create-an-app)

## Build with

This Project is build with React and Vite. It uses the Spotify ["Implicit Grant Flow"](https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow) api. 

>[!WARNING]
> This project uses Spotifys "Implicit Grant Flow". The implicit grant flow has some significant security flaws, so Spotify strongly advise against using this flow. If you need to implement authorization where storing your client secret is not possible, use [Authorization code with PKCE](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow) instead.

## Licenses 

- Interfacedesign: [Creative Commons Attribution Share Alike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/)
- Software: MIT License - Copyright (c) 2024 Sebastian Hauser

## Infos

[Mein Portfolio: hausersebastian.de](www.hausersebastian.de)

[^1]: Based on a Codecademy tutorial

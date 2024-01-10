import "./App.css";
import { useState } from "react";

// My spotify app details
const clientID = "6e2963e631af4b11a07cae2b52f0a347";
const clientPass = "0c36bbe2f2194b6e81580f1ba520aa01";

function MainPage() {
  // Fetch/input variables
  const [artistSearch, setartistSearch] = useState("");
  const [tracks, settracks] = useState([]);
  const [artistName, setname] = useState("");

  // Fetch Spotify API to get access token / artist data / artist tracks
  async function searchSpotify(event) {
    event.preventDefault();
    console.log("INSIDE METHOD");

    try {
      // Get access token
      const accessToken = await fetchAccessToken();
      console.log(accessToken);

      // Fetch artist data
      const artistData = await fetchArtistData(accessToken, artistSearch);
      console.log(artistData);

      // Get artist ID
      const current = artistData.artists.items[0];
      const name = current.name;
      setname(name);
      const ID = current.id;
      console.log("Artist: " + artistName);

      // Get artist tracks from ID and add to array
      const trackArray = await fetchArtistTracks(accessToken, ID);
      settracks(trackArray.tracks);
    } catch (error) {
      console.error("ERROR:", error);
    }
  }
  // Sets user input
  function setInput(event) {
    setartistSearch(event.target.value);
    console.log("Search SET");
  }
  // Get spotify API Access Token
  async function fetchAccessToken() {
    const authorisationURL = "https://accounts.spotify.com/api/token";
    const authFetch = await fetch(authorisationURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${clientID}:${clientPass}`)}`,
      },
      body: "grant_type=client_credentials",
    });

    const authResponse = await authFetch.json();
    return authResponse.access_token;
  }
  // Iterate through tracks array to list song names/albums
  function trackList() {
    return (
      <ul>
        {tracks.map((track, i) => (
          <li key={i}>
            <strong>{i + 1} </strong> &nbsp; {track.name} &nbsp;
            <strong>Album:</strong> &nbsp; {track.album.name}
          </li>
        ))}
      </ul>
    );
  }

  // UI Design
  return (
    <div className="App">
      <h1 id="streamHeader">Stream Search</h1>
      <form onSubmit={searchSpotify}>
        <label id="artistLabel">Enter Artist name:</label>
        <input
          type="text"
          id="artistInput"
          placeholder="Search Artist"
          // Sets artistSearch at any point of a user's search
          onChange={setInput}
        />
        <button type="submit" id="submitBut">
          Search
        </button>
      </form>
      <div>
        <h3>{artistName}</h3>
        {trackList()}
      </div>
    </div>
  );
}

// Get artist data using token
async function fetchArtistData(token, userInput) {
  const artistEndpoint = `https://api.spotify.com/v1/search?q=${userInput}&type=artist`;

  const artistRequest = await fetch(artistEndpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return artistRequest.json();
}

// Get artist tracks using token and artist ID
async function fetchArtistTracks(token, artID) {
  const artistTrackEndpoint = `https://api.spotify.com/v1/artists/${artID}/top-tracks?market=US`;
  const tracksRequest = await fetch(artistTrackEndpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return tracksRequest.json();
}

// Run application (main method)
export default MainPage;

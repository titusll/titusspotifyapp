// Spotify Fetch methods

// Get spotify API Access Token
export async function fetchAccessToken(spotifyID, spotifyPass) {
  const authorisationURL = "https://accounts.spotify.com/api/token";
  const authFetch = await fetch(authorisationURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${spotifyID}:${spotifyPass}`)}`,
    },
    body: "grant_type=client_credentials",
  });

  const authResponse = await authFetch.json();
  return authResponse.access_token;
}

// Get artist data using token and user input
export async function fetchArtistData(token, userInput) {
  const artistEndpoint = `https://api.spotify.com/v1/search?q=${userInput}&type=artist`;

  const artistRequest = await fetch(artistEndpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return artistRequest.json();
}

// Get artist tracks using token and artist ID (NZ market)
export async function fetchArtistTracksNZ(token, artID) {
  const artistTrackEndpoint = `https://api.spotify.com/v1/artists/${artID}/top-tracks?market=NZ`;
  const tracksRequest = await fetch(artistTrackEndpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return tracksRequest.json();
}

// Get artist tracks using token, artist ID and selected country market
export async function fetchArtistTracksSELECTED(token, artID, country) {
  const artistTrackEndpoint = `https://api.spotify.com/v1/artists/${artID}/top-tracks?market=${country}`;
  const tracksRequest = await fetch(artistTrackEndpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return tracksRequest.json();
}

// Iterate through tracks array to list song names/albums
export function trackList(arrayTracks) {
  return (
    <ul>
      {arrayTracks.map((track, i) => (
        <li key={i}>
          <strong>{i + 1} </strong> &nbsp; {track.name} &nbsp;
          <strong>Album:</strong> &nbsp; {track.album.name}
        </li>
      ))}
    </ul>
  );
}

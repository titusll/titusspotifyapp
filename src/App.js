import "./App.css";
import { useState } from "react";
import {
  fetchAccessToken,
  fetchArtistData,
  fetchArtistTracksNZ,
  fetchArtistTracksSELECTED,
  trackList,
} from "./FetchFunctions.js";

// My spotify app details
const clientID = "6e2963e631af4b11a07cae2b52f0a347";
const clientPass = "0c36bbe2f2194b6e81580f1ba520aa01";

function MainPage() {
  // Fetch/input variables
  const [artistSearch, setartistSearch] = useState("");
  // Set default to US to prevent errors with no drop down selection
  const [inputCountry, setinputCountry] = useState("US");
  const [tracksNZ, settracksNZ] = useState([]);
  const [tracksSELECTED, settracksSELECTED] = useState([]);
  const [artistName, setname] = useState("");

  // Fetch Spotify API to get artist data
  async function searchSpotify(event) {
    event.preventDefault();
    console.log("INSIDE METHOD");

    try {
      // Get access token
      const accessToken = await fetchAccessToken(clientID, clientPass);
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

      // Get artist tracks from ID and add to array (NZ)
      const trackArray = await fetchArtistTracksNZ(accessToken, ID);
      settracksNZ(trackArray.tracks);

      // Get artist tracks from selected country and add to array (selected country array)
      const trackArraySELECTED = await fetchArtistTracksSELECTED(
        accessToken,
        ID,
        inputCountry
      );
      settracksSELECTED(trackArraySELECTED.tracks);
    } catch (error) {
      console.error("ERROR:", error);
    }
  }
  // Set artist input
  function setInput(event) {
    setartistSearch(event.target.value);
    console.log("Search SET");
  }

  // Set country input
  function setCountry(event) {
    setinputCountry(event.target.value);
    console.log("Country SET" + inputCountry);
  }

  // UI Design
  return (
    <div className="App">
      <h1 id="streamHeader">Stream Search</h1>
      <p id="subTitle">
        Search for an artist on Spotify and compare their top tracks to NZ
      </p>
      <form onSubmit={searchSpotify}>
        <label id="artistLabel">Enter Artist name:</label>
        <input
          type="text"
          id="artistInput"
          placeholder="Search Artist"
          onChange={setInput}
        />
        <label id="dropDownLabel"> Select a Country: </label>
        <select id="countryDropdown" onChange={setCountry}>
          <option value="US">USA</option>
          <option value="AU">Australia</option>
          <option value="CN">China</option>
          <option value="JP">Japan</option>
          <option value="SA"> Saudi Arabia</option>
          <option value="ZA"> South Africa</option>
          <option value="AE">United Arab Emirates</option>
        </select>
        <button type="submit" id="submitBut">
          Search
        </button>
      </form>
      <div>
        <h2>{artistName}</h2>
        <h4 id="nzTitle">NZ</h4>
        {trackList(tracksNZ)}
      </div>
      <div>
        <h4 id="countryTitle">{inputCountry}</h4>
        {trackList(tracksSELECTED)}
      </div>
    </div>
  );
}

// Run application (main method)
export default MainPage;

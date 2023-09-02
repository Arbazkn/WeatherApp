import CurrentLocation from "./CurrentLocation.js";
import {
  setPlaceHolderText,
  addSpinner,
  displayError,
  displayAPIError,
  updateScreenReaderConfirmation,
  updateDisplay,
} from "./domFunctions.js";
import {
  setLocationObject,
  getHomeLocation,
  getWeatherFromCoords,
  getCoordsFromAPI,
  cleanText,
} from "./dataFunctions.js";
//import { JSON } from "/body-parser.js";
const CurrentLoc = new CurrentLocation();

const initApp = () => {
  // add listeners
  const geoButton = document.getElementById("getLocation");
  geoButton.addEventListener("click", getGeoWeather);

  const homeButton = document.getElementById("home");
  homeButton.addEventListener("click", loadWeather);

  const saveButton = document.getElementById("saveLocation");
  saveButton.addEventListener("click", savedLocation);

  const unitChangeButton = document.getElementById("unit");
  unitChangeButton.addEventListener("click", setUnitPref);

  const refreshButton = document.getElementById("refresh");
  refreshButton.addEventListener("click", refreshWeather);

  const locationEntry = document.getElementById("searchBar__form");
  locationEntry.addEventListener("submit", submitNewLocation);

  // set up
  setPlaceHolderText();

  // load weather (default)
  loadWeather();
};

const getGeoWeather = (event) => {
  if (event) {
    if (event.type === "click") {
      // add spinner
      const mapIcon = document.querySelector(".fa-map-marker-alt");
      addSpinner(mapIcon);
    }
  }
  if (!navigator.geolocation) geoError();
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

const geoError = (errObj) => {
  const errMsg = errObj ? errObj.message : "Geo Location not Supported";
  displayError(errMsg, errMsg);
};

const geoSuccess = (positionObj) => {
  const myCoordsObjs = {
    lat: positionObj.coords.latitude,
    lon: positionObj.coords.longitude,
    name: `Lat:${positionObj.coords.latitude}, Long:${positionObj.coords.longitude}`,
  };

  // set location object
  setLocationObject(CurrentLoc, myCoordsObjs);
  // update data and display
  updateDataAndDisplay(CurrentLoc);
};

const loadWeather = (event) => {
  const savedLocation = getHomeLocation();
  if (!savedLocation && !event) return getGeoWeather();
  if (!savedLocation && event) {
    if (event.type == "click") {
      displayError(
        "No home Location saved",
        "Sorry, Please save your home location first!."
      );
    }
  } else if (savedLocation && !event) {
    // default
    displayHomeLocationWeather(savedLocation);
  } else {
    // button clicked
    const homeIcon = document.querySelector(".fa-home");
    addSpinner(homeIcon);
    displayHomeLocationWeather(savedLocation);
  }
};

const displayHomeLocationWeather = (homeLocation) => {
  if (typeof homeLocation == "string") {
    const locationJson = JSON.parse(homeLocation);
    const myCoordsObjs = {
      lat: locationJson.lat,
      lon: locationJson.lon,
      name: locationJson.name,
      unit: locationJson.unit,
    };
    setLocationObject(CurrentLoc, myCoordsObjs);
    updateDataAndDisplay(CurrentLoc);
  }
};

const savedLocation = () => {
  if (CurrentLoc.getLat() && CurrentLoc.getLon()) {
    const saveIcon = document.querySelector(".fa-save");
    addSpinner(saveIcon);
    const myCoordsObjs = {
      lat: CurrentLoc.getLat(),
      lon: CurrentLoc.getLon(),
      name: CurrentLoc.getName(),
      unit: CurrentLoc.getUnit(),
    };
    localStorage.setItem(
      "defaultWeatherLocation",
      JSON.stringify(myCoordsObjs)
    );
    updateScreenReaderConfirmation("Current Location Saved!");
  }
};

const setUnitPref = () => {
  const unitIcon = document.querySelector(".fa-chart-bar");
  addSpinner(unitIcon);
  if (CurrentLoc.getLat() && CurrentLoc.getLon()) {
    CurrentLoc.toggleUnit();

    const myCoordsObjs = {
      lat: CurrentLoc.getLat(),
      lon: CurrentLoc.getLon(),
      name: CurrentLoc.getName(),
      unit: CurrentLoc.getUnit(),
    };
    localStorage.setItem(
      "defaultWeatherLocation",
      JSON.stringify(myCoordsObjs)
    );
    updateDataAndDisplay(CurrentLoc);
  }
};

const refreshWeather = () => {
  const refreshIcon = document.querySelector(".fa-sync-alt");
  addSpinner(refreshIcon);
  updateDataAndDisplay(CurrentLoc);
};

const submitNewLocation = async (event) => {
  event.preventDefault();
  const text = document.getElementById("searchBar__text").value;
  const entryText = cleanText(text);
  if (!entryText.length) return;

  const locationIcon = document.querySelector(".fa-search");
  addSpinner(locationIcon);

  // call weather API
  const coordsData = await getCoordsFromAPI(entryText, CurrentLoc.getUnit());
  // work with API data
  if (coordsData) {
    if (coordsData.cod === 200) {
      // success
      const myCoordsObjs = {
        lat: coordsData.coord.lat,
        lon: coordsData.coord.lon,
        name: coordsData.sys.country
          ? `${coordsData.name}, ${coordsData.sys.country}`
          : coordsData.name,
      };
      setLocationObject(CurrentLoc, myCoordsObjs);
      updateDataAndDisplay(CurrentLoc);
    } else {
      // error
      displayAPIError(coordsData);
    }
  } else {
    displayError("Connection Error", "Connection Error");
  }
};

const updateDataAndDisplay = async (locationObj) => {
  const weatherJson = await getWeatherFromCoords(locationObj);
  if (weatherJson) {
    updateDisplay(weatherJson, locationObj);
  }
};

document.addEventListener("DOMContentLoaded", initApp);

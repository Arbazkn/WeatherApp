const WEATHER_API_KEY = "9ed96184ac8b739ef6027df38e3c794f";
const VISUAL_WEATHER_API_KEY = "4ATRR34XYZZ6SQW9WLYTDX3XU";

export const setLocationObject = (locObj, coordsObj) => {
  const { lat, lon, name, unit } = coordsObj;
  locObj.setLat(lat);
  locObj.setLon(lon);
  locObj.setName(name);
  if (unit) {
    locObj.setUnit(unit);
  }
};

export const getHomeLocation = () => {
  return localStorage.getItem("defaultWeatherLocation");
};

export const getWeatherFromCoords = async (locationObj) => {
  const lat = locationObj.getLat();
  const lon = locationObj.getLon();
  const units = locationObj.getUnit() == "imperial" ? "uk" : "metric";
  // const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude=minutely,houryly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?include=days&unitGroup=${units}&key=${VISUAL_WEATHER_API_KEY}&contentType=json`;

  try {
    const weatherStream = await fetch(url);
    const weatherJson = weatherStream.json();
    return weatherJson;
  } catch (err) {
    console.log(err);
  }
};

export const getCoordsFromAPI = async (entryText, unit) => {
  const regex = /^\d+$/g;
  const flag = regex.test(entryText) ? "zip" : "q";
  const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${unit}&appid=${WEATHER_API_KEY}`;
  const encodedURI = encodeURI(url);
  try {
    const dataStream = await fetch(encodedURI);
    const jsonData = await dataStream.json();
    return jsonData;
  } catch (err) {
    console.log(err);
  }
};

export const cleanText = (text) => {
  const regex = / {2, }/g;
  const entryText = text.replaceAll(regex, "").trim();
  return entryText;
};
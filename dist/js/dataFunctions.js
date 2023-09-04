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
  /*const lat = locationObj.getLat();
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
  }*/

  const urlDataObject = {
    lat: locationObj.getLat(),
    lon: locationObj.getLon(),
    unit: locationObj.getUnit() == "us" ? "us" : "uk",
  };

  try {
    const weatherStream = await fetch("./.netlify/functions/get_weather", {
      method: "POST",
      body: JSON.stringify(urlDataObject),
    });
    const weatherData = await weatherStream.json();
    return weatherData;
  } catch (err) {
    console.log(err);
  }
};

export const getCoordsFromAPI = async (entryText, unit) => {
  const regex = /^\d+$/g;
  const flag = regex.test(entryText) ? "zip" : "q";
  /*
  const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${unit}&appid=${WEATHER_API_KEY}`;
  const encodedURI = encodeURI(url);
  try {
    const dataStream = await fetch(encodedURI);
    const jsonData = await dataStream.json();
    return jsonData;
  } catch (err) {
    console.log(err);
  }*/

  const urlDataObject = {
    text: entryText,
    unit: unit,
  };
  try {
    const dataStream = await fetch("./.netlify/functions/get_coords", {
      method: "POST",
      body: JSON.stringify(urlDataObject),
    });

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

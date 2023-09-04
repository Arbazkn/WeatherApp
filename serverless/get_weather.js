import fetch from "node-fetch";

const { VISUAL_WEATHER_API_KEY } = process.env;

export async function handler(event, context) {
  const params = JSON.parse(event.body);
  const { lat, lon, unit } = params;
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?include=days&unitGroup=${unit}&key=${VISUAL_WEATHER_API_KEY}&contentType=json`;

  try {
    const weatherStream = await fetch(url);
    const weatherJson = await weatherStream.json();
    return {
      statusCode: 200,
      body: JSON.stringify(weatherJson),
    };
  } catch (err) {
    return {
      statusCode: 422,
      body: err.stack,
    };
  }
}

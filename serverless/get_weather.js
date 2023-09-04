import axios from "axios";

const { VISUAL_WEATHER_API_KEY } = process.env;

export async function handler(event, context) {
  const params = JSON.parse(event.body);
  const { lat, lon, unit } = params;
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?include=days&unitGroup=${unit}&key=${VISUAL_WEATHER_API_KEY}&contentType=json`;

  try {
    const response = await axios.get(url);
    const weatherStream = response.data;
    return {
      statusCode: 200,
      body: JSON.stringify(weatherStream),
    };
  } catch (err) {
    return {
      statusCode: 422,
      body: err.stack,
    };
  }
}

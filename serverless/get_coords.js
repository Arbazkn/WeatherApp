import fetch from "node-fetch";

const { WEATHER_API_KEY } = process.env;

export async function handler(event, context) {
  const params = JSON.parse(event.body);
  const { text, unit } = params;
  const regex = /^\d+$/g;
  const flag = regex.test(text) ? "zip" : "q";

  const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${text}&units=${unit}&appid=${WEATHER_API_KEY}`;
  const encodedURI = encodeURI(url);
  try {
    const dataStream = await fetch(url);
    const jsonData = await dataStream.json();
    return {
      statusCode: 200,
      body: JSON.stringify(jsonData),
    };
  } catch (err) {
    return {
      statusCode: 422,
      body: err.stack,
    };
  }
}

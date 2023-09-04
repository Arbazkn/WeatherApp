export const setPlaceHolderText = () => {
  const input = document.getElementById("searchBar__text");
  window.innerHeight < 400
    ? (input.placeholder = "City, State, Country")
    : (input.placeholder = "City, State, Country or Zip Code");
};

export const addSpinner = (element) => {
  animateButton(element);
  setTimeout(animateButton, 10000, element);
};

const animateButton = (element) => {
  element.classList.toggle("none");
  element.nextElementSibling.classList.toggle("block");
  element.nextElementSibling.classList.toggle("none");
};
export const displayError = (headerMsg, screenReaderMsg) => {
  updateWeatherLocationHeader(headerMsg);
  updateScreenReaderConfirmation(screenReaderMsg);
};

const updateWeatherLocationHeader = (msg) => {
  const h1 = document.getElementById("currentForecast__location");
  if (msg.indexOf("Lat:") !== -1 && msg.indexOf("Long:") !== -1) {
    const messageArr = msg.split(" ");
    const mapArray = messageArr.map((msg) => {
      return msg.replace(":", ": ");
    });

    const lat =
      mapArray[0].indexOf("-") == -1
        ? mapArray[0].slice(0, 10)
        : mapArray[0].slice(0, 11);
    const lon =
      mapArray[1].indexOf("-") == -1
        ? mapArray[1].slice(0, 11)
        : mapArray[1].slice(0, 12);
    h1.textContent = `${lat} * ${lon}`;
  } else {
    h1.textContent = msg;
  }
};

export const updateScreenReaderConfirmation = (msg) => {
  document.getElementById("confirmation").textContent = msg;
};

export const displayAPIError = (statusCode) => {
  const properMsg = toProperMessage(statusCode.message);
  updateWeatherLocationHeader(properMsg);
  updateScreenReaderConfirmation(`${properMsg}. Please try again.`);
  console.log(properMsg);
};

const toProperMessage = (msg) => {
  const words = msg.split(" ");
  const properWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return properWords.join(" ");
};

export const updateDisplay = (weatherJson, locationObj) => {
  fadeDisplay();
  clearDisplay();

  const weatherClass = getWeatherClass(weatherJson.days[0].icon);
  setBackgroundImage(weatherClass);

  const screenReaderWeather = buildScreenReader(weatherJson, locationObj);
  updateScreenReaderConfirmation(screenReaderWeather);
  updateWeatherLocationHeader(locationObj.getName());

  //current conditions
  const ccArray = createCurrentConditionsDivs(
    weatherJson,
    locationObj.getUnit()
  );

  displayCurrenctConditions(ccArray);

  displaySixDayForecast(weatherJson);
  setFocusonSearch();
  fadeDisplay();
};

const fadeDisplay = () => {
  const cc = document.getElementById("currentForecast");
  cc.classList.toggle("zero-vis");
  cc.classList.toggle("fade-in");

  const dailyForecast = document.getElementById("dailyForecast");
  dailyForecast.classList.toggle("zero-vis");
  dailyForecast.classList.toggle("fade-in");
};

const clearDisplay = () => {
  const cc = document.getElementById("currentForecast__conditions");
  deleteContents(cc);

  const dailyForecast = document.getElementById("dailyForecast__contents");
  deleteContents(dailyForecast);
};

const deleteContents = (parentElement) => {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};

const getWeatherClass = (icon) => {
  /* 
  const firstTwoChars = icon.slice(0, 2);
  const lastChars = icon.slice(2);
  const weatherLookup = {
    09: "snow",
    10: "rain",
    11: "rain",
    13: "snow",
    50: "fog",
  };
  */
  const splitedIcon = icon.split("-");
  const firstTwoChars = splitedIcon[0];
  const lastChars = icon.split("-")[splitedIcon.lenght - 1];

  const weatherLookup = {
    "09": "snow",
    10: "rain",
    11: "rain",
    13: "snow",
    50: "fog",
  };
  /* const weatherLookup = {
    snow
    snow-showers-day
    snow-showers-night
    thunder-rain
    thunder-showers-day
    thunder-showers-night
    rain
    showers-day
    showers-night
    fog
    wind
    cloudy
    partly-cloudy-day 
    partly-cloudy-night
    clear-day
    clear-night
  };
  */

  let weatherClass;
  if (weatherLookup[firstTwoChars]) {
    weatherClass = weatherLookup[firstTwoChars];
  } else if (lastChars == "day") {
    weatherClass = "clouds";
  } else {
    weatherClass = "night";
  }
  return weatherClass;
};

const setBackgroundImage = (weatherClass) => {
  document.documentElement.classList.add(weatherClass);
  document.documentElement.classList.forEach((img) => {
    if (img !== weatherClass) document.documentElement.classList.remove(img);
  });
};

const buildScreenReader = (weatherJson, locationObj) => {
  const location = locationObj.getName();
  const unit = locationObj.getUnit();

  const tempUnit = unit == "us" ? "farenheit" : "celsius";
  return `${weatherJson.days[0].conditions} and ${Math.round(
    Number(weatherJson.days[0].temp)
  )}° ${tempUnit} in ${location}`;
};

const setFocusonSearch = () => {
  document.getElementById("searchBar__text").focus();
};

const createCurrentConditionsDivs = (weatherJson, unit) => {
  const tempUnit = unit == "us" ? "F" : "C";
  const windUnit = unit == "us" ? "mph" : "m/s";

  const icon = createMainImgDiv(
    weatherJson.days[0].icon,
    weatherJson.days[0].conditions
  );

  const temp = createElem(
    "div",
    "temp",
    `${Math.round(Number(weatherJson.days[0].temp))}°`,
    tempUnit
  );
  const properDesc = toProperMessage(weatherJson.days[0].conditions);
  const desc = createElem("div", "desc", properDesc);
  const feels = createElem(
    "div",
    "feels",
    `Feels like ${Math.round(Number(weatherJson.days[0].feelslike))}°`
  );

  const maxTemp = createElem(
    "div",
    "maxtemp",
    `High ${Math.round(Number(weatherJson.days[0].tempmax))}°`
  );
  const minTemp = createElem(
    "div",
    "mintemp",
    `Low ${Math.round(Number(weatherJson.days[0].tempmin))}°`
  );
  const humidity = createElem(
    "div",
    "humidity",
    `Humidity ${Math.round(Number(weatherJson.days[0].humidity))}%`
  );
  const wind = createElem(
    "div",
    "wind",
    `Wind ${Math.round(Number(weatherJson.days[0].windspeed))} ${windUnit}`
  );

  return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind];
};

const createMainImgDiv = (icon, altText) => {
  const iconDiv = createElem("div", "icon");
  iconDiv.id = "icon";
  const faIcon = translateIconToFontAwesome(icon);
  faIcon.title = altText;
  iconDiv.appendChild(faIcon);
  return iconDiv;
};

const createElem = (elemType, divClass, divText, unit) => {
  const div = document.createElement(elemType);
  div.className = divClass;
  if (divText) {
    div.textContent = divText;
  }
  if (divClass === "temp") {
    const unitDiv = document.createElement("div");
    unitDiv.className = "unit";
    unitDiv.textContent = unit;
    div.appendChild(unitDiv);
  }
  return div;
};

const translateIconToFontAwesome = (icon) => {
  const i = document.createElement("i");
  const firstTwoChars = icon.slice(0, 2);
  const lastChar = icon.slice(2);

  switch (firstTwoChars) {
    case "01":
      if (lastChar == "d") {
        i.classList.add("far", "fa-sun");
      } else {
        i.classList.add("far", "fa-moon");
      }
      break;
    case "02":
      if (lastChar == "d") {
        i.classList.add("fas", "fa-cloud-sun");
      } else {
        i.classList.add("fas", "fa-cloud-moon");
      }
      break;
    case "03":
      i.classList.add("fas", "fa-cloud");
      break;
    case "04":
      i.classList.add("fas", "fa-cloud-meatball");
      break;
    case "09":
      i.classList.add("fas", "fa-cloud-rain");
      break;
    case "10":
      if (lastChar == "d") {
        i.classList.add("fas", "fa-cloud-sun-rain");
      } else {
        i.classList.add("fas", "fa-cloud-moon-rain");
      }
      break;
    case "11":
      i.classList.add("fas", "fa-poo-storm");
      break;
    case "13":
      i.classList.add("far", "fa-snowflake");
      break;
    case "14":
      i.classList.add("fas", "fa-smog");
      break;
    default:
      i.classList.add("far", "fa-question-circle");
  }

  return i;
};

const displayCurrenctConditions = (currentConditionArray) => {
  const ccContainer = document.getElementById("currentForecast__conditions");
  currentConditionArray.forEach((cc) => {
    ccContainer.appendChild(cc);
  });
};

const displaySixDayForecast = (weatherJson) => {
  for (let i = 1; i <= 6; i++) {
    const dfArray = createDailyForecastDivs(weatherJson.days[i]);
    displayDailyForecast(dfArray);
  }
};

const createDailyForecastDivs = (dayWeather) => {
  const dayAbbrivationText = getDayAbbrivation(dayWeather.datetimeEpoch);
  const dayAbbrivation = createElem("p", "dayAbbreviation", dayAbbrivationText);
  const dayIcon = createDailyForecastIcon(
    dayWeather.icon,
    dayWeather.conditions
  );

  const dayHigh = createElem(
    "p",
    "dayHigh",
    `${Math.round(Number(dayWeather.tempmax))}°`
  );
  const dayLow = createElem(
    "p",
    "dayLow",
    `${Math.round(Number(dayWeather.tempmin))}°`
  );
  return [dayAbbrivation, dayIcon, dayHigh, dayLow];
};

const getDayAbbrivation = (data) => {
  const dateObj = new Date(data * 1000);
  const utcString = dateObj.toUTCString();
  return utcString.slice(0, 3).toUpperCase();
};

const createDailyForecastIcon = (icon, altText) => {
  const img = document.createElement("img");
  img.src = `https://www.visualcrossing.com/img/${icon}.svg`;
  img.alt = altText;
  return img;
};

const displayDailyForecast = (dfArray) => {
  const dayDiv = createElem("div", "forecastDay");
  dfArray.forEach((el) => {
    dayDiv.appendChild(el);
  });
  const dailyForecastContainer = document.getElementById(
    "dailyForecast__contents"
  );
  dailyForecastContainer.appendChild(dayDiv);
};

let searchInput = document.querySelector(".weather-search");
let city = document.querySelector(".weather-city");
let day = document.querySelector(".weather-day");
let humidity = document.querySelector(".weather-indicator-humidity > .value");
let wind = document.querySelector(".weather-indicator-wind > .value");
let pressure = document.querySelector(".weather-indicator-pressure > .value");
let image = document.querySelector(".weather-img");
let temperature = document.querySelector(".weather-temperature > .value");

let forecastBlock = document.querySelector(".weather-forecast");

let apiKey = "9032ee4b2d64613b7b8a2ff464de0c80";
let weatherBasePoint =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" +
  apiKey;

let forecastBasePoint =
  "https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=" +
  apiKey;

const weatherImages = [
  {
    url: "images/clear-sky.png",
    ids: [800],
  },
  {
    url: "images/broken-clouds.png",
    ids: [803, 804],
  },
  {
    url: "images/few-clouds.png",
    ids: [801],
  },
  {
    url: "images/mist.png",
    ids: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
  },
  {
    url: "images/rain.png",
    ids: [501, 502, 503, 504],
  },
  {
    url: "images/scattered-clouds.png",
    ids: [802],
  },
  {
    url: "images/shower-rain.png",
    ids: [313, 520, 521, 522, 531, 300, 301, 302, 311, 312, 313, 314, 321],
  },
  {
    url: "images/snow.png",
    ids: [511, 600, 601, 602, 611, 612, 615, 616, 620, 621, 622],
  },
  {
    url: "images/thunderstorm.png",
    ids: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
  },
];

let getForecastByCityID = async (id) => {
  let point = forecastBasePoint + "&id=" + id;

  let response = await fetch(point);
  let forecastObj = await response.json();

  let forecastList = forecastObj.list;

  let listArr = [];

  forecastList.forEach((day) => {
    const dayName = new Date(day.dt_txt.replace(" ", "T"));
    let hour = dayName.getHours();

    if (hour === 12) {
      listArr.push(day);
    }
  });

  updateForecast(listArr);
};

const getWeatherByCityName = async (city) => {
  let point = weatherBasePoint + "&q=" + city;

  let response = await fetch(point);
  let weather = await response.json();

  console.log(weather);

  return weather;
};

searchInput.addEventListener("keydown", async (e) => {
  if (e.keyCode === 13) {
    let city = searchInput.value;
    let currentWeather = await getWeatherByCityName(city);

    getForecastByCityID(currentWeather.id);
    displayWeather(currentWeather);
  }
});

const displayWeather = (weather) => {
  city.textContent = weather.name + ", " + weather.sys.country;
  day.textContent = getDayOfWeek();
  humidity.textContent = weather.main.humidity;
  pressure.textContent = weather.main.pressure;

  let deg = weather.wind.deg;
  let deriction;

  if (deg > 45 && deg < 135) {
    deriction = "East";
  } else if (deg >= 135 && deg < 225) {
    deriction = "South";
  } else if (deg >= 225 && deg < 315) {
    deriction = "West";
  } else {
    deriction = "North";
  }

  wind.textContent = deriction + ", " + weather.wind.speed;

  temperature.textContent =
    weather.main.temp > 0
      ? "+" + Math.round(weather.main.temp)
      : Math.round(weather.main.temp);

  let imgID = weather.weather[0].id;

  weatherImages.forEach((obj) => {
    if (obj.ids.includes(imgID)) {
      image.src = obj.url;
    }
  });
};

const updateForecast = (forecast) => {
  forecastBlock.innerHTML = "";

  forecast.forEach((day) => {
    let icon =
      "http://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png";

    let dayName = getDayOfWeek(day.dt * 1000);

    let temperature =
      day.main.temp > 0
        ? "+" + Math.round(day.main.temp)
        : Math.round(day.main.temp);

    let forecast = `<article class="weather-forecast-item">
     <img
       src=${icon}
       alt=${day.weather[0].description}
       class="weather-forecast-img"
     />
     <p class="weather-forecast-day">${dayName}</p>
     <p class="weather-forecast-temperature">
       <span class="value">${temperature}</span>&deg;C
     </p>
   </article>`;

    forecastBlock.insertAdjacentHTML("beforeend", forecast);
  });
};

const getDayOfWeek = (dt = new Date().getTime()) => {
  return new Date(dt).toLocaleDateString("en-EN", { weekday: "long" });
};

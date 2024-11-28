import  { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import "./App.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

/* images */
import searchIcon from "./assets/search2.png";
import sunIcon from "./assets/sun10.gif";
import cloudIcon from "./assets/clouds.gif";
import drizzleIcon from "./assets/drissel.gif";
import rainIcon from "./assets/rain1.gif";
import windIcon from "./assets/wind.gif";
import snowIcon from "./assets/snow.gif";
import humidityIcon from "./assets/humidity1.gif";

/* background images or videos */
import sunnyBackground from "./assets/sunnyback.jpg";
import rainBackground from "./assets/rain11.jpg";
import snowBackground from "./assets/snow.jpg";
import cloudBackground from "./assets/cloud7.jpg";
import drizzleBackground from "./assets/drizzleback1.jpg";
import windBackground from "./assets/wind20.jpg";
import defaultBackground from "./assets/mainb.jpg";

// WeatherDetails Component
const WeatherDetails = ({ weather, temperatureHistory }) => {
  if (!weather) return null;

  const { icon, temp, city, country, lat, lon, humidity, windSpeed } = weather;

  // Graph Data Configuration
  const graphData = {
    labels: temperatureHistory.map((entry) => entry.time),
    datasets: [
      {
        label: "Temperature (°C)",
        data: temperatureHistory.map((entry) => entry.temp),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
    
  };

  return (
    <>
      <div className="image">
        <img src={icon} alt="Weather Icon" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">
        {city}, {country}
      </div>
      <div className="cord">
        <div>
          <span className="lat">Latitude:</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="lon">Longitude:</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="Humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="Wind" className="icon" />
          <div className="data">
            <div className="wind-speed">{windSpeed} m/s</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
      {/* Graph Section */}
      <div className="graph-container">
        <h3>Temperature Trends</h3>
        <Line data={graphData} />
      </div>
       {/* Weather Icons Row */}
       <div className="weather-icons-row">
        <div className="icon-container">
          <img src={sunIcon} alt="Sunny" />
          <p>Sunny</p>
        </div>
        <div className="icon-container">
          <img src={rainIcon} alt="Rainy" />
          <p>Rainy</p>
        </div>
        <div className="icon-container">
          <img src={windIcon} alt="Windy" />
          <p>Wind</p>
        </div>
        <div className="icon-container">
          <img src={humidityIcon} alt="Humidity" />
          <p>Humidity</p>
        </div>
        <div className="icon-container">
          <img src={drizzleIcon} alt="Drizzle" />
          <p>Drizzle</p>
        </div>
        <div className="icon-container">
          <img src={snowIcon} alt="Snowy" />
          <p>Snow</p>
        </div>
        </div>
    </>
  );
};

WeatherDetails.propTypes = {
  weather: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    temp: PropTypes.number.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
    windSpeed: PropTypes.number.isRequired,
  }),
  temperatureHistory: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      temp: PropTypes.number.isRequired,
    })
  ),
};

// Main App Component
function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [temperatureHistory, setTemperatureHistory] = useState([]);
  const [dateTime, setDateTime] = useState({});

  useEffect(() => {
    document.body.style.backgroundImage = `url(${defaultBackground})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";
    document.body.style.transition = "background 0.5s ease";

    const interval = setInterval(() => {
      const now = new Date();
      setDateTime({
        time: now.toLocaleTimeString(),
        date: now.toLocaleDateString(),
        day: now.toLocaleString("en-us", { weekday: "long" }),
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval when the component unmounts
  }, []); // Set default background on load

  const fetchWeather = async () => {
    const API_KEY = "befce031d831591eea5c26dc85b076be";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();

      const weatherIconMap = {
        "01d": sunIcon,
        "01n": sunIcon,
        "02d": cloudIcon,
        "02n": cloudIcon,
        "09d": drizzleIcon,
        "09n": drizzleIcon,
        "10d": rainIcon,
        "10n": rainIcon,
        "13d": snowIcon,
        "13n": snowIcon,
        "50d": windIcon,
        "50n": windIcon,
      };

      const backgroundMap = {
        Clear: sunnyBackground,
        Clouds: cloudBackground,
        Rain: rainBackground,
        Drizzle: drizzleBackground,
        Snow: snowBackground,
        Wind: windBackground,
      };

      const weatherData = {
        icon: weatherIconMap[data.weather[0].icon] || sunIcon,
        temp: data.main.temp,
        city: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      };

      setWeather(weatherData);

      // Add the latest temperature to the history
      setTemperatureHistory((prev) => [
        ...prev.slice(-9), // Keep only the last 9 entries
        { time: new Date().toLocaleTimeString(), temp: data.main.temp },
      ]);

      // Set background based on weather condition or wind speed
      const mainWeather = data.weather[0].main;
      let newBackground = backgroundMap[mainWeather] || defaultBackground;

      // If wind speed is greater than 5 m/s, use wind background
      if (data.wind.speed > 5) {
        newBackground = windBackground;
      }

      document.body.style.backgroundImage = `url(${newBackground})`;

    } catch (error) {
      alert(error.message);
    }
  };

  const handleSearchIconClick = () => {
    if (city.trim()) {
      fetchWeather();
    }
  };

  return (
    <div className="app">
      <div className="heading">Weather Today</div>
      <div className="input-wrapper">
        <span className="search-icon" onClick={handleSearchIconClick}>
          <img src={searchIcon} alt="Search Icon" />
        </span>
        <input
          type="text"
          className="cityInput"
          placeholder="Search City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && fetchWeather()}
        />
      </div>
      <WeatherDetails weather={weather} temperatureHistory={temperatureHistory} />
      <div className="date-time">
        <div className="time">{dateTime.time}</div>
        <div className="date">{dateTime.date}</div>
        <div className="day">{dateTime.day}</div>
      </div>
    </div>
  );
}

export default App;  
import React, { useEffect, useState } from "react";
import axios from "axios";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // Use the environment variable

  // Fetch weather data based on latitude and longitude
  const fetchWeatherByCoordinates = async (lat, lon) => {
    try {
      setError("");
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat,
            lon,
            appid: API_KEY,
            units: "metric",
          },
        }
      );
      setWeatherData(response.data);
    } catch (err) {
      setError("Unable to fetch weather data for your location.");
    }
  };

  // Fetch weather data based on city name
  const fetchWeatherByCity = async () => {
    try {
      setError("");
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: city,
            appid: API_KEY,
            units: "metric",
          },
        }
      );
      setWeatherData(response.data);
    } catch (err) {
      setError("City not found. Please enter a valid city name.");
      setWeatherData(null);
    }
  };

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  // Get user’s current location on component mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lon: longitude });
        fetchWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        setError("Geolocation not supported or permission denied.");
      }
    );
  }, []);

  return (
    <div>
      <h1>Weather App</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          placeholder="Enter city name"
        />
        <button type="submit">Get Weather</button>
      </form>
      {error && <p className="error">{error}</p>}
      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Condition: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default Weather;

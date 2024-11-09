import React, { useEffect, useState } from "react";
import axios from "axios";

// Utility function to format Unix timestamp to Bangkok time
const formatDate = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleString("en-US", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Separate function to fetch weather data from API
const fetchWeatherData = async (
  lat,
  lon,
  API_KEY,
  setWeatherData,
  setError
) => {
  try {
    setError("");
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: { lat, lon, appid: API_KEY, units: "metric" },
      }
    );
    setWeatherData(response.data);
  } catch {
    setError("Unable to fetch weather data for your location.");
  }
};

const Weather = () => {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lon: longitude });
        fetchWeatherData(
          latitude,
          longitude,
          API_KEY,
          setWeatherData,
          setError
        );
        setLoading(false);
      },
      () => {
        setError("Geolocation not supported or permission denied.");
        setLoading(false);
      }
    );
  }, []);

  return (
    <>
      {loading && (
        <div className="w-screen h-svh grid place-items-center">Loading...</div>
      )}
      {error && <p className="error">{error}</p>}
      {weatherData && (
        <main
          className={`w-screen h-svh px-4 py-8 text-center flex flex-col ${
            weatherData.dt > weatherData.sys.sunrise
              ? "bg-slate-50 text-black"
              : "bg-slate-900 text-white"
          }`}
        >
          <>
            <div className="flex flex-col justify-evenly h-full">
              <div className="flex flex-col">
                <h1 className="font-bold text-2xl mb-2">{weatherData.name}</h1>
                <p>{formatDate(weatherData.dt)}</p>
              </div>
              <div className="grid place-items-center">
                <img
                  className="block animate-cloud"
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                  alt=""
                  loading="lazy"
                />
              </div>
              <div>
                <h2 className="font-bold text-6xl mb-4">
                  {weatherData.main.temp}°<small>C</small>
                </h2>
                <p>{weatherData.weather[0].main}</p>
                <p>{weatherData.weather[0].description}</p>
              </div>
            </div>
            <ul className="flex gap-4">
              <li className="flex-1 flex flex-col">
                Humidity: {weatherData.main.humidity}%
              </li>
              <li className="flex-1 flex flex-col">
                Wind Speed: {weatherData.wind.speed} m/s
              </li>
            </ul>
          </>
        </main>
      )}
    </>
  );
};

export default Weather;

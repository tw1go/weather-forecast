import React, { useState, useEffect } from 'react';
import Daily from './daily-forecast';
import './App.css';
import ReactPlayer from 'react-player';
import Videobg from './img/sky-bg.mp4';

const App = () => {

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [loadWeather, setLoadWeather] = useState(0);

  const videosrc = Videobg;

  const options = {
    enableHighAccuracy: true,
    timeout: 3000,
    maximumAge: 0
  };

  const success = (pos) => {
    var crd = pos.coords;

    setLatitude(crd.latitude);
    setLongitude(crd.longitude);

    setLoadWeather(loadWeather + 1);

  }

  const error = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  if (loadWeather === 0) {
    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  const weatherAPI = '5cd595786ce09fcfdbbacd7c93fa206d';

  const [timezone, setTimezone] = useState("");

  const [currTemp, setCurrTemp] = useState(0);
  const [currSunrise, setCurrSunrise] = useState(0);
  const [currSunset, setCurrSunset] = useState(0);
  const [currWeather, setCurrWeather] = useState("");
  const [currIconCode, setCurrIconCode] = useState("");

  const [dailyForecast, setDailyForecast] = useState([]);

  const getForecast = async () => {

    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly&appid=${weatherAPI}&units=metric`);
    const data = await response.json();
    setTimezone(data.timezone);
    setCurrTemp(data.current.temp);
    setCurrSunrise(data.current.sunrise);
    setCurrSunset(data.current.sunset);
    setCurrWeather(data.current.weather[0].description);
    setCurrIconCode(data.current.weather[0].icon);

    // console.log(data);

    setDailyForecast(data.daily);
  }

  useEffect(() => {
    if (loadWeather === 1) {
      getForecast();
    }
  }, [loadWeather]); // eslint-disable-line react-hooks/exhaustive-deps

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000)
    return () => {
      clearInterval(timer);
    }
  });


  const successHTML = () => (
    <div>
      <h1 className="title"> {timezone} </h1>
      <div className="current info">
        <div className="time-date-wrap">
          <span className="time"> {date.toLocaleTimeString()} </span>
          <span className="date"> {date.toLocaleDateString()} </span>
        </div>
        <span className="temperature">{currTemp} °C</span>
        <span className="weather-icon">
          <img src={`http://openweathermap.org/img/wn/${currIconCode}@2x.png`} alt="" />
          <span className="weather-description">{currWeather}</span>
        </span>
        <div className="sun-details">
          <span className="sunrise">Sunrise: {new Date(currSunrise * 1000).toLocaleTimeString()}</span>
          <span className="sunset">Sunset: {new Date(currSunset * 1000).toLocaleTimeString()}</span>
        </div>
      </div>
      <div className="daily info">
        {dailyForecast.slice(1).map(daily => (
          <Daily
            key={daily.dt}
            date={new Date(daily.dt * 1000).toLocaleDateString()}
            sunrise={new Date(daily.sunrise * 1000).toLocaleTimeString()}
            sunset={new Date(daily.sunset * 1000).toLocaleTimeString()}
            tempMin={daily.temp.min}
            tempMax={daily.temp.max}
            weatherDesc={daily.weather[0].description}
            weatherIcon={daily.weather[0].icon}
          />
        ))}
      </div>
    </div>
  );

  const errorHTML = () => (
    <div className="error-wrap">
      <div className="error-message">
        Please allow us to access your location to get the latest weather forecasting in your area.
      </div>
    </div>
  );


  return (
    <div className="main">
      <ReactPlayer
        url={videosrc}
        loop={true}
        muted={true}
        playing={true}
        className='video-bg'
      />
      {loadWeather === 1 ? successHTML() : errorHTML()}
    </div>
  );
}

export default App;

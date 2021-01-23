import React from 'react';

const daily = (props) => (

    <div className="daily-wrap">
            <span className = "date"> {props.date} </span>
        <span className="temperature">{props.tempMin} °C - {props.tempMax} °C</span>
        <span className="weather-icon">
        <img src={`http://openweathermap.org/img/wn/${props.weatherIcon}@2x.png`} alt=""/>
        <span className="weather-description">{props.weatherDesc}</span>
        </span>
        <div className="sun-details">
            <span className="sunrise">Sunrise: {props.sunrise}</span>
            <span className="sunset">Sunset: {props.sunset}</span>
        </div>
    </div>
    

)

export default daily;

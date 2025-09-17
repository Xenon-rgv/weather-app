// to get date
function currentDate() {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const today = new Date();
  document.getElementById("date").textContent = today.toLocaleDateString(
    "en-US",
    options
  );
}
currentDate();

//weather icons
const weatherIcons = {
    snow: './assets/images/icon-snow.webp',
  fog: './assets/images/icon-fog.webp',
  drizzle: './assets/images/icon-drizzle.webp',
  partlyCloudy: './assets/images/icon-partly-cloudy.webp',
  sunny: './assets/images/icon-sunny.webp',
  overcast: './assets/images/icon-overcast.webp',
  rain: './assets/images/icon-rain.webp',
  storm: './assets/images/icon-storm.webp'
};


// get default weather before search
async function getDefaultWeather() {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=5.790&longitude=6.104&hourly=relative_humidity_2m,precipitation&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&current_weather=true";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data: " + response.status);
    }

    const data = await response.json();

    // Temperature
    const temp = data.current_weather?.temperature;
    const tempUnit = data.current_weather_units?.temperature;
    const temperatureEl = document.getElementById("temperature");
    const dispTemp = document.getElementById("current_temp");
    if (dispTemp && temp != null && tempUnit) {
      dispTemp.innerHTML = `${temp}°`;
    }
    if (temperatureEl && temp != null && tempUnit) {
      temperatureEl.innerHTML = `<h2>Temperature</h2> <h3>${temp} <span style="font-size:16px;">${tempUnit}</span></h3>`;
    }

    //weather - img;
    const img = document.getElementById("img");

         if (img) {
          let icon = "";

          if (temp <= 0) {
            icon = "snow";
          } else if (temp > 0 && temp <= 10) {
            icon = "fog";
          } else if (temp > 10 && temp <= 18) {
            icon = "drizzle";
          } else if (temp > 18 && temp <= 24) {
            icon = "partlyCloudy";
          } else if (temp > 24 && temp <= 30) {
            icon = "sunny";
          } else if (temp > 30 && temp <= 35) {
            icon = "overcast";
          } else if (temp > 35 && temp <= 40) {
            icon = "rain";
          } else if (temp > 40) {
            icon = "storm";
          }

          img.innerHTML = `<img src='${weatherIcons[icon]}' style='height: 100px; width: 140px;' alt='Weather icon'>`;
        }
   

    // Humidity
    const humidityValue = data.hourly?.relative_humidity_2m?.[0];
    const humidityUnit = data.hourly_units?.relative_humidity_2m;
    const humidityEl = document.getElementById("humidity");
    if (humidityEl && humidityValue != null && humidityUnit) {
      humidityEl.innerHTML = `<h2>Humidity</h2> <h3>${humidityValue} <span style="font-size:16px;">${humidityUnit}</span></h3>`;
    }

    // Wind Speed
    const windValue = data.current_weather?.windspeed;
    const windUnit = data.current_weather_units?.windspeed;
    const windEl = document.getElementById("wind");
    if (windEl && windValue != null && windUnit) {
      windEl.innerHTML = `<h2>Wind</h2> <h3>${windValue} <span style="font-size:16px;">${windUnit}</span></h3>`;
    }

    //precipitation value
    const precipitationValue = data.hourly?.precipitation;
    const precipitationUnit = data.hourly_units?.precipitation;
    const precipitationEl = document.getElementById("precipitation");
    if (precipitationEl && precipitationValue != null && precipitationUnit) {
      precipitationEl.innerHTML = `<h2>Wind</h2> <h3>${precipitationValueValue} <span style="font-size:16px;">${precipitationUnitUnit}</span></h3>`;
    }

    return {
      temperature: temp,
      humidity: humidityValue,
      wind: windValue,
      precipitation: precipitationValue,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}
getDefaultWeather();


//get daily forcast
async function defaultDaily() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min&timezone=auto";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data: " + response.status);
    }

    const data = await response.json();

    // Get today's max and min temperatures
    const maxTemp = data.daily.temperature_2m_max;
    const minTemp = data.daily.temperature_2m_min;
    // const date = data.daily.time[0];

    const forecastDivs = document.querySelectorAll(".daily-forcast > div");

    forecastDivs.forEach((div, i) => {
      const max = maxTemp[i];
      const min = minTemp[i];

      if (max !== undefined && min !== undefined) {
        // Find the image container in this specific div
        const imgContainer = div.querySelector(".dailyImg");

        // Find the temperature h2 in this specific div
        const tempH2 = div.querySelector("h2");

        // Update weather icon for each day
        if (imgContainer) {
          let iconKey = "";

          if (max <= 0) {
            iconKey = "snow";
          } else if (max > 0 && max <= 10) {
            iconKey = "fog";
          } else if (max > 10 && max <= 18) {
            iconKey = "drizzle";
          } else if (max > 18 && max <= 24) {
            iconKey = "partlyCloudy";
          } else if (max > 24 && max <= 30) {
            iconKey = "sunny";
          } else if (max > 30 && max <= 35) {
            iconKey = "overcast";
          } else if (max > 35 && max <= 40) {
            iconKey = "rain";
          } else if (max > 40) {
            iconKey = "storm";
          }

          imgContainer.innerHTML = `<img src='${weatherIcons[iconKey]}' style='height: 40px; width: 50px;' alt='Weather icon'>`;
        }

        // Update temperature display with max and min
        if (tempH2) {
          tempH2.innerHTML = `
                                <div class="temp-container">
                                    <span class="max-temp">${Math.round(
                                      max
                                    )}°</span>
                                    <span class="min-temp">${Math.round(
                                      min
                                    )}°</span>
                                </div>
                            `;
        }
      }
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);

    // Show error message
    const forecastDivs = document.querySelectorAll(".daily-forcast > div");
    forecastDivs.forEach((div) => {
      const imgContainer = div.querySelector(".dailyImg");
      if (imgContainer) {
        imgContainer.innerHTML = '<span style="color: #ff6b6b;">Error</span>';
      }
    });
  }
}
defaultDaily();


// get hour-forcast before search
async function getDefaultTime() {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m";

  try {
    const response = await fetch(url);
    const data = await response.json(); 

    const time = data.hourly.time;
    const hourTemp = data.hourly.temperature_2m;

    const iconDiv = document.querySelectorAll(".hour-forcast > div > .hourly-img");
    const timeDiv = document.querySelectorAll(".hour-forcast > div > .hour");
    const tempDiv = document.querySelectorAll(".hour-forcast > div > .hour-temp");

    const now = new Date();
    const currentHour = now.toISOString().slice(0, 13) + ":00";

    const index = time.indexOf(currentHour);

    if (index !== -1) {
      const nextHours = (time.slice(index, index + 8)) ;
      const nextTemps = hourTemp.slice(index, index + 8);

      nextHours.forEach((t, i) => {
        if (timeDiv[i]) timeDiv[i].textContent = t.slice(11, 16); 
        if (tempDiv[i]) tempDiv[i].textContent = `${nextTemps[i]}°C`;


             if (iconDiv[i]) {
          let hourIcon = "";
          const temp = nextTemps[i]; 

          if (temp <= 0) {
            hourIcon = "snow";
          } else if (temp > 0 && temp <= 10) {
            hourIcon = "fog";
          } else if (temp > 10 && temp <= 18) {
            hourIcon = "drizzle";
          } else if (temp > 18 && temp <= 24) {
            hourIcon = "partlyCloudy";
          } else if (temp > 24 && temp <= 30) {
            hourIcon = "sunny";
          } else if (temp > 30 && temp <= 35) {
            hourIcon = "overcast";
          } else if (temp > 35 && temp <= 40) {
            hourIcon = "rain";
          } else if (temp > 40) {
            hourIcon = "storm";
          }

          iconDiv[i].innerHTML = `<img src='${weatherIcons[hourIcon]}' style='height: 35px; width: 35px; ' alt='Weather icon'>`;
        }
        
      });
    } else {
      console.error("Current hour not found in API data.");
    }

  } catch (error) {
    console.error("Error fetching location data:", error);
  }
}

getDefaultTime();


async function getCity(event) {
  event.preventDefault();

  const city = document.getElementById("cityName").value.trim();
  const resultsDiv = document.getElementById("resultsDiv");

  if (!city) {
    resultsDiv.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=10&language=en&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch location data.");
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      resultsDiv.innerHTML = "<p>No location found for the specified city.</p>";
      return;
    }

    const { latitude, longitude, name, country } = data.results[0];
    const location = document.getElementById("location");
    location.innerText = `${name}, ${country}`;

    async function getWeather() {
      const url =
        "https://api.open-meteo.com/v1/forecast?" +
        `latitude=${latitude}&longitude=${longitude}` +
        "&hourly=relative_humidity_2m" +
        "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation" +
        "&current_weather=true";

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch weather data: " + response.status);
        }

        const data = await response.json();

        // Temperature
        const temp = data.current_weather?.temperature;
        const tempUnit = data.current_weather_units?.temperature;
        const temperatureEl = document.getElementById("temperature");
        const dispTemp = document.getElementById("current_temp");
        if (dispTemp && temp != null && tempUnit) {
          dispTemp.innerHTML = `${temp}°`;
        }
        if (temperatureEl && temp != null && tempUnit) {
          temperatureEl.innerHTML = `<h2>Temperature</h2> <h3>${temp} <span style="font-size:16px;">${tempUnit}</span></h3>`;
        }

    const img = document.getElementById("img");

         if (img) {
          let icon = "";

          if (temp <= 0) {
            icon = "snow";
          } else if (temp > 0 && temp <= 10) {
            icon = "fog";
          } else if (temp > 10 && temp <= 18) {
            icon = "drizzle";
          } else if (temp > 18 && temp <= 24) {
            icon = "partlyCloudy";
          } else if (temp > 24 && temp <= 30) {
            icon = "sunny";
          } else if (temp > 30 && temp <= 35) {
            icon = "overcast";
          } else if (temp > 35 && temp <= 40) {
            icon = "rain";
          } else if (temp > 40) {
            icon = "storm";
          }

          img.innerHTML = `<img src='${weatherIcons[icon]}' style='height: 100px; width: 140px;' alt='Weather icon'>`;
        }

        // Humidity
        const humidityValue = data.hourly?.relative_humidity_2m?.[0];
        const humidityUnit = data.hourly_units?.relative_humidity_2m;
        const humidityEl = document.getElementById("humidity");
        if (humidityEl && humidityValue != null && humidityUnit) {
          humidityEl.innerHTML = `<h2>Humidity</h2> <h3>${humidityValue} <span style="font-size:16px;">${humidityUnit}</span></h3>`;
        }

        // Wind Speed
        const windValue = data.current_weather?.windspeed;
        const windUnit = data.current_weather_units?.windspeed;
        const windEl = document.getElementById("wind");
        if (windEl && windValue != null && windUnit) {
          windEl.innerHTML = `<h2>Wind</h2> <h3>${windValue} <span style="font-size:16px;">${windUnit}</span></h3>`;
        }

        return {
          temperature: temp,
          humidity: humidityValue,
          wind: windValue,
        };
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }
    getWeather();
  async function getDaily() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data: " + response.status);
    }

    const data = await response.json();

    // Get today's max and min temperatures
    const maxTemp = data.daily.temperature_2m_max;
    const minTemp = data.daily.temperature_2m_min;
    // const date = data.daily.time[0];

    const forecastDivs = document.querySelectorAll(".daily-forcast > div");

    forecastDivs.forEach((div, i) => {
      const max = maxTemp[i];
      const min = minTemp[i];

      if (max !== undefined && min !== undefined) {
        // Find the image container in this specific div
        const imgContainer = div.querySelector(".dailyImg");

        // Find the temperature h2 in this specific div
        const tempH2 = div.querySelector("h2");

        // Update weather icon for each day
        if (imgContainer) {
          let iconKey = "";

          if (max <= 0) {
            iconKey = "snow";
          } else if (max > 0 && max <= 10) {
            iconKey = "fog";
          } else if (max > 10 && max <= 18) {
            iconKey = "drizzle";
          } else if (max > 18 && max <= 24) {
            iconKey = "partlyCloudy";
          } else if (max > 24 && max <= 30) {
            iconKey = "sunny";
          } else if (max > 30 && max <= 35) {
            iconKey = "overcast";
          } else if (max > 35 && max <= 40) {
            iconKey = "rain";
          } else if (max > 40) {
            iconKey = "storm";
          }

          imgContainer.innerHTML = `<img src='${weatherIcons[iconKey]}' style='height: 40px; width: 50px;' alt='Weather icon'>`;
        }

        // Update temperature display with max and min
        if (tempH2) {
          tempH2.innerHTML = `
                                <div class="temp-container">
                                    <span class="max-temp">${Math.round(
                                      max
                                    )}°</span>
                                    <span class="min-temp">${Math.round(
                                      min
                                    )}°</span>
                                </div>
                            `;
        }
      }
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);

    // Show error message
    const forecastDivs = document.querySelectorAll(".daily-forcast > div");
    forecastDivs.forEach((div) => {
      const imgContainer = div.querySelector(".dailyImg");
      if (imgContainer) {
        imgContainer.innerHTML = '<span style="color: #ff6b6b;">Error</span>';
      }
    });
  }
}
getDaily();
async function getDefaultTime() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;

  try {
    const response = await fetch(url);
    const data = await response.json(); 

    const time = data.hourly.time;
    const hourTemp = data.hourly.temperature_2m;

    const iconDiv = document.querySelectorAll(".hour-forcast > div > .hourly-img");
    const timeDiv = document.querySelectorAll(".hour-forcast > div > .hour");
    const tempDiv = document.querySelectorAll(".hour-forcast > div > .hour-temp");

    const now = new Date();
    const currentHour = now.toISOString().slice(0, 13) + ":00";

    const index = time.indexOf(currentHour);

    if (index !== -1) {
      const nextHours = (time.slice(index, index + 8)) ;
      const nextTemps = hourTemp.slice(index, index + 8);

      nextHours.forEach((t, i) => {
        if (timeDiv[i]) timeDiv[i].textContent = t.slice(11, 16); 
        if (tempDiv[i]) tempDiv[i].textContent = `${nextTemps[i]}°C`;


             if (iconDiv[i]) {
          let hourIcon = "";
          const temp = nextTemps[i]; 

          if (temp <= 0) {
            hourIcon = "snow";
          } else if (temp > 0 && temp <= 10) {
            hourIcon = "fog";
          } else if (temp > 10 && temp <= 18) {
            hourIcon = "drizzle";
          } else if (temp > 18 && temp <= 24) {
            hourIcon = "partlyCloudy";
          } else if (temp > 24 && temp <= 30) {
            hourIcon = "sunny";
          } else if (temp > 30 && temp <= 35) {
            hourIcon = "overcast";
          } else if (temp > 35 && temp <= 40) {
            hourIcon = "rain";
          } else if (temp > 40) {
            hourIcon = "storm";
          }

          iconDiv[i].innerHTML = `<img src='${weatherIcons[hourIcon]}' style='height: 35px; width: 35px; ' alt='Weather icon'>`;
        }
        
      });
    } else {
      console.error("Current hour not found in API data.");
    }

  } catch (error) {
    console.error("Error fetching location data:", error);
  }
}

getDefaultTime();

  } catch (error) {
    console.error("Error fetching location data:", error);
    resultsDiv.innerHTML = `<p>Error fetching data. Please try again.</p>`;
  }
}


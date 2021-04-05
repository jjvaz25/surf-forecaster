let elPortoBtn = document.getElementById('elPorto');
elPortoBtn.addEventListener('click', () => {
  fetchForecast('33.902925','-118.420773', 'El Porto');
})

let veniceBtn = document.getElementById('venice');
veniceBtn.addEventListener('click', () => {
  fetchForecast('33.9852448','-118.4769287', "Venice Breakwater");
})

let venturaBtn = document.getElementById('ventura');
venturaBtn.addEventListener('click', () => {
  fetchForecast('34.27340851985283','-119.30465363625197', 'Ventura Point');
})

let sanDiegoBtn = document.getElementById('sanDiego');
sanDiegoBtn.addEventListener('click', () => {
  fetchForecast('32.89175761527285','-117.25357949748246', 'Black\'s beach');
})

let loadingContainer = document.querySelector('.loading-container');

const fetchForecast = async (lat, lon, spotName) => {
  loadingContainer.classList.toggle('visually-hidden');
  let cardContainer = document.getElementById('card-container');
  cardContainer.innerHTML = ''
  let apiUrl = `https://api.worldweatheronline.com/premium/v1/marine.ashx?key=4361ead8c2274f4ba4221736210304&q=${lat},${lon}&format=json`
  try {
    // fetch the raw response
    const rawResponse = await fetch(apiUrl);

    if (!rawResponse.ok) {
      throw new Error(rawResponse);
    }

    // could also key off status directly
    if (rawResponse.status === 404) {
      throw new Error('Not found');
    }

    const jsonResponse = await rawResponse.json();
    console.log(jsonResponse);

    for (let i = 2; i <= 5; i+=3) {
      let weatherData = jsonResponse.data.weather[0].hourly[i]
      let weatherObj = {
        description: weatherData.weatherDesc[0].value,
        icon: weatherData.weatherIconUrl[0].value,
        airTemp: weatherData.tempF,
        waterTemp: weatherData.waterTemp_F,
        sunrise: jsonResponse.data.weather[0].astronomy[0].sunrise,
        sunset: jsonResponse.data.weather[0].astronomy[0].sunset,
      }
      let swellObj = {
        swellHeight: weatherData.swellHeight_ft,
        swellPeriod: weatherData.swellPeriod_secs,
        swellDir: weatherData.swellDir16Point,
        windSpeed: weatherData.windspeedMiles,
        windDir: weatherData.winddir16Point,
      }
      generateCard(weatherObj, swellObj, spotName, i);
    }

  } catch (err) {
    console.log('err', err);
  }
  loadingContainer.classList.toggle('visually-hidden');
};

const generateCard = (weatherObj, swellObj, spotName, time) => {
  let forecastTime = time === 2 ? 'Morning' : 'Afternoon'
  let cardContainer = document.getElementById('card-container');
  let cardDiv = document.createElement('div');
  cardDiv.innerHTML = `
    <div class="card mb-5" style="width: 45%">
      <div class="container">
        <div class="row g-2">
          <div class="col-7 my-auto">
            <h1>${spotName}</h1>
            <h6>April 04 2021</h3>
            <h6>${forecastTime} forecast</h6>
          </div>
          <div class="col-5 my-auto">
            <div class="card-img-body">
              <img class="card-img" src="/assets/images/clearsky.png" alt="">
            </div>
            <h6>${weatherObj.description}</h6>
          </div>
        </div>
        <div class="row g-2">
          <div class="col-7">
            <p>Swell: ${swellObj.swellHeight} ft @ ${swellObj.swellPeriod}s ${swellObj.swellDir}</p>
            <p>Wind: ${swellObj.windSpeed}mph ${swellObj.windDir}</p>
          </div>
          <div class="col-5">
            <p>Airtemp: ${weatherObj.airTemp}</p>
            <p>Water temp: ${weatherObj.waterTemp}</p>
          </div>
        </div>
        <div class="row g-2">
          <div class="col-7">
            <p>High: 3:01am, Low: 9:10am</p>
            <p>High: 3:34pm, Low: 10:10pm</p>
          </div>
          <div class="col-5">
            <p>Sunrise: ${weatherObj.sunrise}</p>
            <p>Sunset: ${weatherObj.sunset}</p>
          </div>
        </div>
        <div class="row g-2">
          <button type="button" class="btn btn-primary mb-2">Save Session</button>
        </div>
      </div>
    </div>
  `
  cardContainer.appendChild(cardDiv);
}

// fetchForecast('33.902925','-118.420773', 'El Porto');



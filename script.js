

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

const yourTab = document.querySelector(".yourWeather");
const searchTab = document.querySelector(".searchWeather");
const grantAccess = document.querySelector(".grant-location-container");
const searchBox = document.querySelector(".ui-searchBox");
const displayWeather = document.querySelector(".ui-displayWeather");
const loadingScreen = document.querySelector(".loadingScreen")
const error = document.querySelector(".errorScreen");


yourTab.addEventListener('click', ()=> switchTab(yourTab))
searchTab.addEventListener('click', ()=> switchTab(searchTab))

function switchTab(clickedTab){
    
    error.classList.add("hidden");
    //Your Weather is Active and Search Tab is clicked
    if (yourTab.classList.contains("currentTab") && clickedTab!=yourTab){
        searchTab.classList.add("currentTab");
        yourTab.classList.remove("currentTab");

        grantAccess.classList.add("hidden");
        searchBox.classList.remove("hidden");   // Display Search Box
        displayWeather.classList.add("hidden");
    }
    
    else if(searchTab.classList.contains("currentTab") && clickedTab!=searchTab ){

        yourTab.classList.add("currentTab");
        searchTab.classList.remove("currentTab");
        
        searchBox.classList.add("hidden");      // Hide Search Box
        displayWeather.classList.add("hidden");     //Hide Weather Container
        getfromSessionStorage();
    }
    
}

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccess.classList.remove("hidden");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAccess.classList.add("hidden");
    //make loader visible
    loadingScreen.classList.remove("hidden");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  weatherData = await response.json();

        loadingScreen.classList.add("hidden");
        displayWeather.classList.remove("hidden");
        renderWeatherInfo(weatherData);
    }
    catch(err) {
        loadingScreen.classList.remove("hidden");
        //HW

    }

}

const form = document.querySelector("[data-searchForm");
const input = document.querySelector("[data-searchInput")

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (input.value === "")
        return;
    else
        fetchSearchWeatherInfo(input.value);
})

async function fetchSearchWeatherInfo( city ){
    
    error.classList.add("hidden");
    displayWeather.classList.add("hidden");
    loadingScreen.classList.remove("hidden");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const weatherData = await response.json();
        loadingScreen.classList.add("hidden");  
        
        renderWeatherInfo(weatherData);
    }
    catch(err){
        // Show Error if not able to Fetch the data
        loadingScreen.classList.add("hidden");
        error.classList.remove("hidden");
    }
    // Render Weather Info
}


function renderWeatherInfo(weatherData){

    if (weatherData?.name == undefined ){
        // Show Error if city in Incorrect
        loadingScreen.classList.add("hidden");
        error.classList.remove("hidden");
        return;
    }

    displayWeather.classList.remove("hidden");  

    const cityName = document.querySelector("[data-cityName]");
    const countryImage = document.querySelector("[data-countryImage]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-clouds]");

    cityName.innerText = weatherData?.name;
    countryImage.src = `https://flagcdn.com/144x108/${weatherData?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherData?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherData?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherData?.main?.temp} °C`;
    windSpeed.innerText = `${weatherData?.wind?.speed} m/s`;
    humidity.innerText = `${weatherData?.main?.humidity}%`;
    clouds.innerText = `${weatherData?.clouds?.all}%`;
}

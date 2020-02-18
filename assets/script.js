/* 
Will rely on momentJS for easy date formatting, jQuery for DOM manipulation and ajax API requests.

will need access to DOM elements:
search field, submit button (click event listener), previous search city list (event delegation for these dynamic buttons), search results content area, 5-day forecast content area

search results: current and forecast areas will be fully cleared and created dynamically whenever a new set of results are returned
*/

const $cityInput = document.querySelector("#cityInput");
const $searchHistory = document.querySelector("#recentSearches");

let apiKey = "87afb66ebd77a3851e1a006191d29852";
let iconURL = "http://openweathermap.org/img/w/";
let searchHistory = {
    cities: 
    []
};


//retrieve any saved city search history. If exists, save to session variable
function getStoredData(){
    let getSearchHistory = JSON.parse(localStorage.getItem("weatherHistory"));
    if (getSearchHistory){
        searchHistory = getSearchHistory;
    }
}



$("document").ready(function() {
    //listen for search history clicks
    $("document").on("click", ".previousSearch", function(event){
       let cityName = $(this).text();
       getWeatherResults(cityName);
    });

    //listen for new city search
    $("#searchSubmit").on("click", function(event){
        let cityName = $("#cityInput").val();
        cityName =  cityName.trim();
        getWeatherResults(cityName);
    });

    //perform API requests for a specific city
    function getWeatherResults(city){
        let currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
        let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;


        //get current weather conditions
        $.ajax({
            url: currentQueryURL,
            method: "GET"
          }).then(function(response) {
            updateCurrentWeatherDisplay(response);
          });



        //get forecast weather details
        $.ajax({
            url: forecastQueryURL,
            method: "GET"
          }).then(function(response) {
            console.log(response);
            updateForecastDisplay(response.list);
          });


        
    }

    //parse current weather response data and paint to the DOM
    //this function will be responsible for gathering UV index information, as the response data has the requisite lat/lon data needed to get UVI
    function updateCurrentWeatherDisplay(response){
        $("#currentWeatherBox").removeClass('hidden');

        let currentWeather = response;
        let date = getDate(parseInt(currentWeather.dt));
        let city = currentWeather.name;
        let temp = currentWeather.main.temp;
        let humidity = currentWeather.main.humidity;
        let wind = currentWeather.wind.speed;
        getUVIndex(currentWeather.coord);
        let iconSRC = iconURL + (currentWeather.weather[0].icon) + ".png";

        $("#currentWeatherCityName").text(city + " " + date);
        $("#weatherIcon").attr("src", iconSRC).attr("alt", currentWeather.weather[0].main);
        $("#currentTemperature").text(temp);
        $("#currentHumidity").text(humidity);
        $("#currentWindSpeed").text(wind);
    }

    //function which accepts forecast object data and populates 5 days worth of cards with the forecase
    function updateForecastDisplay(forecast){
        for (i in forecast){
            console.log(getDate(forecast[i].dt));
            
        }
    }

    //function which accepts a unix millisecond integer and returns a formatted date string
    function getDate(time){
        return(moment.unix(time).format('l'));
    }

    //function takes a coordinates object sets the DOM element directly when results are returned
    function getUVIndex(coordinates){
        let uvqueryURL = "http://api.openweathermap.org/data/2.5/uvi?lon=" + coordinates.lon + "&lat=" + coordinates.lat + "&appid=" + apiKey;
        $.ajax({
            url: uvqueryURL,
            method: "GET"
          }).then(function(response) {
            $("#currentUV").text(response.value);
        }); 
    }
});





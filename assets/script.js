const $cityInput = $("#cityInput");
const $searchHistory = $("#recentSearches");
const $forecastArea = $("#forecastArea");

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
        for (city in searchHistory.cities){
            updateSearchHistory(searchHistory.cities[city]);
        }
    }
}

function updateSearchHistory(name){
    //if city is not already in search history we will add it to storage and update the DOM
    if (searchHistory.cities.indexOf(name) === -1){
        searchHistory.cities.splice(0, 0, name);
        localStorage.setItem("weatherHistory", JSON.stringify(searchHistory));
        updateSearchHistoryList();      
    }
}

function updateSearchHistoryList(){
    $searchHistory.empty();
    for (city in searchHistory.cities) {
        let newSearchItem = $("<li>");
        newSearchItem.attr("class", "list-group-item previousSearch m-1").text(searchHistory.cities[city]);
        $searchHistory.append(newSearchItem);
    }
}
 

$(document).ready(function() {
    //listen for search history clicks. May want to refactor to pass cityID for repeated searches
    $(document).on("click", ".previousSearch", function(){
       let cityName = $(this).text();
       getWeatherResults(cityName);
    });

    //listen for new city search
    $("#searchSubmit").on("click", function(event){
        let cityName = $cityInput.val();
        cityName =  cityName.trim();
        getWeatherResults(cityName);
    });

    //perform API requests for a specific city for both current and forecasted data
    function getWeatherResults(city){
        let currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
        let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;

        //get current weather conditions
        $.ajax({
            url: currentQueryURL,
            method: "GET"
          }).then(function(response) {
            updateCurrentWeatherDisplay(response);
            updateSearchHistory(response.name, response.id);
          });

        //get forecast weather details
        $.ajax({
            url: forecastQueryURL,
            method: "GET"
          }).then(function(response) {
            updateForecastDisplay(response.list);
          });


        
    }

    //parse current weather response data and paint to the DOM
    //this function will be responsible for gathering UV index information, as the response data has the requisite lat/lon data needed to get UVI
    function updateCurrentWeatherDisplay(response){
        $("#currentWeatherBox").empty();
        $("#currentWeatherBox").removeClass('hidden');

        let currentWeather = response;
        let date = getDate(parseInt(currentWeather.dt));
        let city = currentWeather.name;
        let temp = currentWeather.main.temp;
        let humidity = currentWeather.main.humidity;
        let wind = currentWeather.wind.speed;
        getUVIndex(currentWeather.coord);
        let iconSRC = iconURL + (currentWeather.weather[0].icon) + ".png";

        let heading = $("<h2>").attr("id", "currentWeatherCityName");
        heading.text(city + " " + date + " ");
        let icon = $("<img>").attr("id", "weatherIcon");
        icon.attr("src", iconSRC).attr("alt", currentWeather.weather[0].main);

        let temperatureP = $("<p>Temperature: <span id='currentTemperature'>" + temp + "</span></p>");
        let humidityP = $("<p>Humidity: <span id='currentHumidity'>" + humidity + "</span></p>");
        let windP = $("<p>Wind Speed: <span id='currentWindSpeed'>" + wind + "</span></p>");
        let uvP = $("<p>UV Index: <span id='currentUV'></span></p>");

        $("#currentWeatherBox").append(heading);
        heading.append(icon);
        $("#currentWeatherBox").append(temperatureP);
        $("#currentWeatherBox").append(humidityP);
        $("#currentWeatherBox").append(windP);
        $("#currentWeatherBox").append(uvP);
    }


    //function which accepts forecast object data and populates 5 days worth of cards with the forecast
    function updateForecastDisplay(forecast){
        //using forecast indexes 2, 10, 18, 26, 34 - this represents one forecast for each day. A more thorough approach would be to digest all data for each day and output relevant averages/min/max values
        let forecastArray = [forecast[2], forecast[10], forecast[18], forecast[26], forecast[34]];
        $forecastArea.empty();
        for (i in forecastArray){
            let nextCard = $("<div>");
            nextCard.attr("class", "card mx-3").attr("style", "width: 10rem;");
            let cardBody = $("<div>");
            cardBody.attr("class", "card-body");
            let cardHeading = $("<h5>");
            cardHeading.attr("class", "card-title");
            cardHeading.text(getDate(forecastArray[i].dt));
            let icon = $("<img>");
            icon.attr("src", iconURL + (forecastArray[i].weather[0].icon) + ".png");
            let tempP = $("<p>");
            tempP.attr("class", "card-text");
            tempP.text("Temp: " + forecastArray[i].main.temp + "°F");
            let humidP = $("<p>");
            humidP.attr("class", "card-text");
            humidP.text("Humidity: " + forecastArray[i].main.humidity);

            cardBody.append(cardHeading);
            cardBody.append(icon);
            cardBody.append(tempP);
            cardBody.append(humidP);
            nextCard.append(cardBody);
            $forecastArea.append(nextCard);
        }
    }

    //function which accepts a unix millisecond integer and returns a formatted date string
    function getDate(time){
        return(moment.unix(time).format('l'));
    }

    //function takes a coordinates object and sets the DOM element directly when results are returned
    function getUVIndex(coordinates){
        let uvqueryURL = "http://api.openweathermap.org/data/2.5/uvi?lon=" + coordinates.lon + "&lat=" + coordinates.lat + "&appid=" + apiKey;
        $.ajax({
            url: uvqueryURL,
            method: "GET"
          }).then(function(response) {
            let uvIndex = parseFloat(response.value);
            $('#currentUV').removeClass();
            $("#currentUV").text(uvIndex);
            
            
            switch (true) {
                case (uvIndex >= 11):
                    $("#currentUV").attr("class", "bg-purple p-2 rounded")
                    break;
                case (uvIndex >= 8):
                    $("#currentUV").attr("class", "bg-danger p-2 rounded")
                    break;
                case (uvIndex >= 6):
                    $("#currentUV").attr("class", "bg-orange p-2 rounded")
                    break;
                case (uvIndex >= 3):
                    $("#currentUV").attr("class", "bg-warning p-2 rounded")
                    break;
                default:
                    $("#currentUV").attr("class", "bg-success p-2 rounded")
                    break;
            }
        }); 
    }


});

//invoking localStorage check (hopefully) while document is loading
getStoredData();
updateSearchHistoryList();



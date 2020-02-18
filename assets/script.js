/* 
Will rely on momentJS for easy date formatting, jQuery for DOM manipulation and ajax API requests.

will need access to DOM elements:
search field, submit button (click event listener), previous search city list (event delegation for these dynamic buttons), search results content area, 5-day forecast content area

search results: current and forecast areas will be fully cleared and created dynamically whenever a new set of results are returned
*/

const $cityInput = document.querySelector("#cityInput");
const $searchHistory = document.querySelector("#recentSearches");

let apiKey = "87afb66ebd77a3851e1a006191d29852";
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
       console.log(cityName);
    });

    //listen for new city search
    $("#searchSubmit").on("click", function(event){
        let cityName = $("#cityInput").val();
        //cityName.trim();
        console.log(cityName);

    });



});





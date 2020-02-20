# Weather-Dashboard
Weather widget using OpenWeatherMap API


# Description

Application uses several API endpoints from OpenWeatherMap: weather, forecast, and uvindex. The results of these requests are processed into dynamically loaded content with the help of jQuery to show current weather conditions, current local UV index, and a 5-day forecast representing mid-morning weather for each day. City result are stored and displayed for easy recalling of recent search locations.

## Notes
> Currently no error handling for API calls. UVIndex API service has shown to be fairly unreliable, often resulting in 40x or 50x errors. 
> Can run clearStoredData() in console to easily clear stored city search history
// API Information

const API_KEY = 'c5aabd5d4916f9b9860f35d69b2f68a1';

let city = 'New York'
let state = "NY"

let latitude = '40.7128';
let longitude = '-73.935242';

const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=5&appid=${API_KEY}`
const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`



const searchButton = $("#search-button");
const input = $("#city-name");




input.on("change", function (e) {
    city = input.val().trim();
    console.log(city);
});

let history = JSON.parse(localStorage.getItem("searchHistory")) ? JSON.parse(localStorage.getItem("searchHistory")) : []
console.log(history)

searchButton.on("click", function (e) {

    $("#search-history").append(` <button id="search-button" class="btn btn-lg fw-bold mb-3">
   ${city}
  </button>`);

    history.push(city)
    localStorage.setItem('searchHistory', JSON.stringify(history))


});


$(document).ready(function () {
    history.map(searchTerm => {
        $("#search-history").append(`<button id="search-button" class="btn btn-lg btn-secondary bg-secondary fw-bold mb-3">
            ${searchTerm}
           </button>`);
    })
})
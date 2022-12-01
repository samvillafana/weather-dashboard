// API Information

const API_KEY = "612c9c103f558f9848feb2430e910936";

// HTML Selectors

const searchButton = $("#search-button");
const input = $("#city-name");
const day1 = $("#day1");
const day2 = $("#day2");
const day3 = $("#day3");
const day4 = $("#day4");
const day5 = $("#day5");


input.on("change", function (e) {
    city = input.val().trim();
});

let history = JSON.parse(localStorage.getItem("searchHistory")) ? JSON.parse(localStorage.getItem("searchHistory")) : []

let coords;


const dateFormatter = (string) => {
    let reverseDate = string.split(" ")[0];
    return new Date(reverseDate).toDateString()
}


const getCoords = async (cityName) => {
    let response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`)
        .then((response) => response.json())
        .then((data) => {
            coords = data[0];
            return data;
        })
        .catch(error => console.log(error));
    return response[0];

}

const getCurrentWeather = async (lat, long) => {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            return data
        })
        .catch(error => console.log(error))
    return response
}

const getForecast = async (lat, long) => {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=imperial&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => console.log(error))
    return response;
}

const capitalize = (word) => {
    let results = '';
    let twoWords = word.split(" ");

    if (!word.includes(" ")) {
        for (let i = 0; i < word.length; i++) {
            if (i === 0) {
                results += word[i].toUpperCase();
            } else {
                results += word[i].toLowerCase();
            }
        }
        return results;
    } else {
        twoWords.forEach((el, idx) => {

            let word = el
            for (let i = 0; i < word.length; i++) {
                if (i === 0) {
                    results += " " + word[i].toUpperCase()
                } else {
                    results += word[i].toLowerCase()
                }
            }

        })
        return results;
    }

}

$(document).ready(function () {
    // loop thru the localStorage items and render to the html page.
    history.map(searchTerm => {
        $("#search-history").append(`<button id="search-button" class="search-button btn btn-lg btn-secondary bg-secondary fw-bold mb-3">
        ${capitalize(searchTerm)}
       </button>`);
    })


    // This function handles the search history api logic
    $(".search-button").on("click", async (e) => {
        let city = e.target.innerText.trim()
        let newCoords = await getCoords(city);
        let currentWeather = await getCurrentWeather(newCoords.lat, newCoords.lon);

        $("#jumbotron").html(`<h2 class="h2 fw-bold ms-3 mt-2 mb-4">${currentWeather.name}<div class="ml-5"><img src='https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png'/></div></h2>
        <p class="mb-3 ms-4">Temp: ${currentWeather.main.temp}</p>
        <p class="mb-3 ms-4">Wind: ${currentWeather.wind.speed}</p>
        <p class="mb-3 ms-4">Humidity: ${currentWeather.main.humidity}</p>`)
        let foreCastData = await getForecast(newCoords.lat, newCoords.lon)
        let fiveDayForecast = await foreCastData.list.filter(el => {
            if (el.dt_txt.includes("00:00:00")) {
                return el
            }
        })
        fiveDayForecast.map((el, idx) => {
            $(`#day${idx + 1}`).html(`<h6 class="card-title">${dateFormatter(el.dt_txt)}</h6>
            <div class="card-text"><img src='https://openweathermap.org/img/w/${el.weather[0].icon}.png'/></div>
            <p class="card-text">Temp: ${el.main.temp}</p>
            <p class="card-text">Wind: ${el.wind.speed}</p>
            <p class="card-text">Humidity: ${el.main.humidity}</p>`)
        })
    })


    // This function handles the input and search button function
    searchButton.on("click", async function () {
        let city = input.val().trim();
        let newCoords = await getCoords(city)
        if (!city) {
            return alert('Please enter a city')
        }
        // Append so the search history
        if (!history.includes(city.toLowerCase())) {
            $("#search-history").append(` <button id="search-button" class="btn btn-lg btn-secondary bg-secondary fw-bold mb-3">
            ${capitalize(city)}
           </button>`);
        }

        if (!history.includes(city.toLowerCase())) {
            history.push(city.toLowerCase())
        }

        localStorage.setItem('searchHistory', JSON.stringify(history))

        // call API and render results to html page
        let currentWeather = await getCurrentWeather(newCoords.lat, newCoords.lon);

        $("#jumbotron").html(`<h2 class="h2 fw-bold ms-3 mt-2 mb-4">${currentWeather.name}<div class="ml-5"><img src='https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png'/></div></h2>
        <p class="mb-3 ms-4">Temp: ${currentWeather.main.temp}</p>
        <p class="mb-3 ms-4">Wind: ${currentWeather.wind.speed}</p>
        <p class="mb-3 ms-4">Humidity: ${currentWeather.main.humidity}</p>`)
        let foreCastData = await getForecast(newCoords.lat, newCoords.lon)
        let fiveDayForecast = await foreCastData.list.filter(el => {
            if (el.dt_txt.includes("00:00:00")) {
                return el
            }
        })
        fiveDayForecast.map((el, idx) => {
            $(`#day${idx + 1}`).html(`<h6 class="card-title">${dateFormatter(el.dt_txt)}</h6>
            <div class="card-text"><img src='https://openweathermap.org/img/w/${el.weather[0].icon}.png'/></div>
            <p class="card-text">Temp: ${el.main.temp}</p>
            <p class="card-text">Wind: ${el.wind.speed}</p>
            <p class="card-text">Humidity: ${el.main.humidity}</p>`)
        })


    });
})

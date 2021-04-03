// const fullURL = 'http://api.airvisual.com/v2/city?city=Los Angeles&state=California&country=USA&key=91429b4a-f2ad-43c5-b772-545a3f2b11f9'

const baseURL = 'https://api.airvisual.com/v2/'
const key = '&key=1a23c2d2-20c5-4178-98e0-2e1b229f7ae5'

// ! Original queries
let cityOptions = document.getElementById('city')
let stateOptions = document.getElementById('state')
let countryOptions = document.getElementById('country')
let country = document.getElementById('country').value
let map = document.getElementById('map')

// ! On Page Load ---- List supported countries
// http://api.airvisual.com/v2/countries?key={{YOUR_API_KEY}} 
// returns an array of supported countries

let countriesURL = `${baseURL}countries?${key}`
        console.log(countriesURL)
        fetch(countriesURL)
                .then(res => { return res.json() })
                .then(countryJSON => listCountries(countryJSON))
                .catch(error => console.log(error))
                function listCountries (countryJSON) {
                        let elements = countryJSON.data
                        elements.unshift({country:'Select an Option'})
                        console.log(elements)
                        elements.forEach(option => {
                                // console.log(option.country)
                                let newOption = document.createElement('option')
                                let newOptionTxt = document.createTextNode(option.country)
                                newOption.appendChild(newOptionTxt)
                                newOption.setAttribute('value',option.country)
                                countryOptions.insertBefore(newOption,countryOptions.lastChild)
                        });
                }

// ! List supported states in a country
//'http://api.airvisual.com/v2/states?country={{COUNTRY_NAME}}&key={{YOUR_API_KEY}}'
// returns an array of supported states within a country

function getStates(country) {
        // console.log(country)
        let statesURL = `${baseURL}states?country=${country}${key}`
        console.log(statesURL)
                fetch(statesURL)
                        .then(res => { return res.json() })
                        .then(stateJSON => listStates(stateJSON))
                        .catch(error => {
                                console.log(error)
                                let newError = document.createElement('p')
                                newError.innerText = 'This country has no states with current air quality data. Please choose another country'
                                dataDiv.appendChild(newError);
                        }) 
                        //statelist
                        function listStates (stateJSON) {
                                while (stateOptions.firstChild) {
                                        stateOptions.removeChild(stateOptions.firstChild);
                                }
                                while (cityOptions.firstChild) {
                                        cityOptions.removeChild(cityOptions.firstChild);
                                }
                                while (dataDiv.firstChild) {
                                        dataDiv.removeChild(dataDiv.firstChild)
                                }
                                while (map.firstChild) {
                                        map.removeChild(map.firstChild)
                                }
                                let displayList = document.getElementById('cityNoDisplay')
                                displayList.style.display = 'block'
                                let displayButton = document.getElementById('card-button')
                                displayButton.style.display = 'block'
                                let elements = stateJSON.data
                                elements.unshift({state:'Select an Option'})
                                console.log(elements)
                                elements.forEach(option => {
                                        // console.log(option.state)
                                        console.log(option)
                                        let newOption = document.createElement('option')
                                        let newOptionTxt = document.createTextNode(option.state)
                                        newOption.appendChild(newOptionTxt)
                                        // algier becomes state HERE
                                        newOption.setAttribute('value',option.state)
                                        stateOptions.insertBefore(newOption,stateOptions.lastChild)
                                });
                        }
}

// ! List supported cities in a state
//'http://api.airvisual.com/v2/cities?state={{STATE_NAME}}&country={{COUNTRY_NAME}}&key={{YOUR_API_KEY}}'
// returns an array of supported cities within a state

function getCities(state,country) {
        country = document.getElementById('country').value
        let citiesURL = `${baseURL}cities?state=${state}&country=${country}${key}`
        console.log(state,country)
        console.log(citiesURL)
                fetch(citiesURL)
                        .then(res => { return res.json() })
                        .then(cityJSON => listCities(cityJSON))
                        .catch(error => {
                                console.log(error)
                                let newError = document.createElement('p')
                                newError.innerText = 'This state has no cities with current air quality data. Please select another Country or State'
                                dataDiv.appendChild(newError);
                        } )
                        //cityList
                        function listCities (cityJSON) {
                                console.log(cityJSON)
                                while (cityOptions.firstChild) {
                                        cityOptions.removeChild(cityOptions.firstChild);
                                    }
                                let elements = cityJSON.data
                                if (cityJSON.data.message) {
                                        noCity()
                                        return null
                                } else {
                                        elements.unshift({city:'Select an Option'})
                                        console.log(elements)
                                        elements.forEach(option => {
                                                console.log(option.city)
                                                let newOption = document.createElement('option')
                                                let newOptionTxt = document.createTextNode(option.city)
                                                newOption.appendChild(newOptionTxt)
                                                newOption.setAttribute('value',option.city)
                                                cityOptions.insertBefore(newOption,cityOptions.lastChild)
                                                citySelection = cityOptions.value
                                        });
                                        console.log(citySelection) 
                                }
                        }

}

// ! Get stats for user selected city
const dataDiv = document.getElementById("dataDiv")

function noCity() {
        let noDisplay = document.getElementById('cityNoDisplay')
        noDisplay.style.display = 'none'
        let noDisplayButton = document.getElementById('card-button')
        noDisplayButton.style.display = 'none'
        let country = `&country=${document.getElementById('country').value}`
        let state = `&state=${document.getElementById('state').value}`
        let city = `city?city=${document.getElementById('state').value}`
        let url = `${baseURL + city + state + country + key}`
        console.log(url);
        fetch(url)
                .then(res => { return res.json() })
                .then(json => displayResults(json))
                .catch(error => {console.log(error)
                let newError = document.createElement('p')
                        newError.innerText = 'This city has no current air quality data. Please select another Country or State'
                        dataDiv.appendChild(newError);
                })  
}

function cityStats(e) {
        console.log(e)
        e.preventDefault()
        let country = `&country=${document.getElementById('country').value}`
        let state = `&state=${document.getElementById('state').value}`
        let city = `city?city=${document.getElementById('city').value}`
        let url = `${baseURL + city + state + country + key}`
        console.log(url);
        fetch(url)
                .then(res => { return res.json() })
                .then(json => displayResults(json))
                .catch(error => console.log(error))  
}

function displayResults(json) {
        console.log('AQI:',json.data.current.pollution.aqius)
        while (dataDiv.firstChild) {
                dataDiv.removeChild(dataDiv.firstChild);
            }
        if (document.getElementById('city').value != 'Select an Option') {
                let aqiData = document.createElement('p')
                let aqiValue = json.data.current.pollution.aqius
                aqiData.innerText = `AQI: ${aqiValue}`
                dataDiv.appendChild(aqiData)

                let advisoryMsg = document.createElement('p')
                let advisoryValue = ['GOOD','MODERATE','UNHEALTHY FOR SENSITIVE GROUPS','UNHEALTHY','DANGEROUS']

                if (aqiValue < 50) {
                        advisoryMsg.innerText = `${advisoryValue[0]}`
                        dataDiv.appendChild(advisoryMsg)
                        console.log('GOOD')
                } else if (aqiValue > 50 && aqiValue < 100) {
                        advisoryMsg.innerText = `${advisoryValue[1]}`
                        dataDiv.appendChild(advisoryMsg)
                        console.log('MODERATE')
                } else if (aqiValue > 100 && aqiValue < 150) {
                        advisoryMsg.innerText = `${advisoryValue[2]}`
                        dataDiv.appendChild(advisoryMsg)
                        console.log('UNHEALTHY FOR SENSITIVE GROUPS')
                } else if (aqiValue > 150 && aqiValue < 200) {
                        advisoryMsg.innerText = `${advisoryValue[3]}`
                        dataDiv.appendChild(advisoryMsg)
                        console.log('UNHEALTHY')
                } else if (aqiValue > 200) {
                        advisoryMsg.innerText = `${advisoryValue[4]}`
                        dataDiv.appendChild(advisoryMsg)
                        console.log('DANGEROUS')
                } else {
                        console.log(e)
                }

        console.log('Longitude:',json.data.location.coordinates[0])
        console.log('Latitude:',json.data.location.coordinates[1])

        let lng = json.data.location.coordinates[0]
        let lat = json.data.location.coordinates[1]

        const gKey = 'AIzaSyAQENxp5sLfLnl2aofEAIeujNOFP5nQzKQ'

        let map;

        function initMap() {
                map = new google.maps.Map(document.getElementById("map"), {
                        center: { lat, lng },
                        zoom: 8,
                });

        } initMap()


        }
}
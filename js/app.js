const autocompleteInput = document.querySelector('.autocompleteInput')
const submitBtn = document.querySelector('.submitBtn')
const formContainer = document.querySelector('.form_container')
const countryInfoContainer = document.querySelector('.countryInfoContainer')

autocompleteInput.addEventListener('input',onInputChange)

getCountryData()

let countryNames = []

async function getCountryData() {
    const countryResource = await fetch('https://restcountries.com/v3.1/all')
    const data = await countryResource.json()
    console.log(data);

    countryNames = data.map((country) => {
        return country.name.common
    })
    // console.log(countryNames);

}

function onInputChange(){

    removeAutoCompleteDropdown()

    const value = autocompleteInput.value.toLowerCase()
    if(value.length !== 0){
        submitBtn.classList.remove('active')
    }
    else{
        submitBtn.classList.add('active')
        return
    }

    
    const filteredNames = []

    countryNames.forEach((countryName) => {
        if(countryName.substr(0, value.length).toLowerCase() === value)
        filteredNames.push(countryName)
    })
    // console.log(filteredNames);

    createAutoCompleteDropdown(filteredNames)


}


 function createAutoCompleteDropdown(List) {
    ul = document.createElement('ul')
    ul.id = "autocompleteList"

    List.forEach(country => {
        const li = document.createElement('li')
        const countryBtn = document.createElement('button')
        countryBtn.innerHTML = country

        countryBtn.addEventListener('click', onCountryButtonClik)

        li.appendChild(countryBtn)
        ul.appendChild(li)
    })

    formContainer.appendChild(ul)
 }

 function removeAutoCompleteDropdown(){
    const listEl = document.getElementById('autocompleteList')
    if(listEl) listEl.remove()
 }

 function onCountryButtonClik(e) {
    const buttonEl = e.target
    autocompleteInput.value = buttonEl.innerHTML
    removeAutoCompleteDropdown()

 }


 submitBtn.addEventListener('click', (e)=> {
    e.preventDefault()
    var countryInfoURL = `https://restcountries.com/v3.1/name/${autocompleteInput.value}{name}?fullText=true`
    fetch(countryInfoURL)
    .then((response) => {
        if(!response.ok){
            if(response.status === 404){
                throw new Error('Enter a valid country name.')
            }
            else if(response.status == 408){
                throw new Error('Response timed out')

            }
            else{
                throw new Error('Network error')

            }
        }
        return response.json()
    })
    .then((data) => {
        // console.log(data);

        countryInfoContainer.innerHTML = `  
        <img src="${data[0].flags.svg}" alt="">
        <h2>${data[0].name.common}</h2>

        <table border="1">
            <tr>
                <th>Country Name:</th>
                <td>${data[0].name.common}</td>
            </tr>
            <tr>
                <th>Total Area:</th>
                <td>${data[0].area}</td>
            </tr>
            <tr>
                <th>Capital:</th>
                <td>${data[0].capital[0]}</td>
            </tr>
            <tr>
                <th>Continent:</th>
                <td>${data[0].Continents[0]}</td>
            </tr>
            <tr>
                <th>Population:</th>
                <td>${data[0].Population}</td>
            </tr>
            <tr>
                <th>Currency:</th>
                <td>${data[0].currencies[Object.keys(data[0].currencies)[0]].name}(${data[0].currencies
                    [Object.keys(data[0].currencies)[0]].symbol}) - ${Object.keys(data[0].Continents)[0]}</td>
            </tr>
            <tr>
                <th>Language:</th>
                <td>${Object.values(data[0].languages).toString().split(",").join(",")}</td>
            </tr>
        </table>`
    })
 })
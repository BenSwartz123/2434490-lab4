const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {
    // Clear previous info and errors
    countryInfo.innerHTML = '';
    borderingCountries.innerHTML = '';
    errorMessage.classList.add('hidden');
    
    // Show spinner
    loadingSpinner.classList.remove('hidden');

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) throw new Error('Country not found with that name');
        
        const data = await response.json();
        const country = data[0];

        // Display main country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
        `;

        // Display bordering countries
        if (country.borders && country.borders.length > 0) {
            for (const code of country.borders) {
                const borderResp = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResp.json();
                const borderCountry = borderData[0];
                const div = document.createElement('div');
                div.innerHTML = `
                    <p>${borderCountry.name.common}</p>
                    <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag" width="80">
                `;
                borderingCountries.appendChild(div);
            }
        } else {
            borderingCountries.innerHTML = '<p>This country has no bordering countries</p>';
        }

    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally {
        // Hide spinner
        loadingSpinner.classList.add('hidden');
    }
}

// Event listeners
searchBtn.addEventListener('click', () => {
    const country = countryInput.value.trim();
    if (country) searchCountry(country);
});

countryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const country = countryInput.value.trim();
        if (country) searchCountry(country);
    }
});



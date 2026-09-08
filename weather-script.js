// API Configuration
const API_KEY = 'e0f80e5bde9e32d6bfbc0a57e6c7ad4e'; // OpenWeatherMap Free API
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const weatherContent = document.getElementById('weatherContent');
const favoritesList = document.getElementById('favoritesList');

// Local Storage
const STORAGE_KEY = 'weatherFavorites';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
    // Load default city
    fetchWeather('São Paulo');
    
    // Event listeners
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
});

// Handle search
function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        cityInput.value = '';
    }
}

// Fetch weather data
async function fetchWeather(city) {
    showLoading(true);
    clearError();
    
    try {
        // Current weather
        const weatherResponse = await fetch(
            `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
        );
        
        if (!weatherResponse.ok) {
            throw new Error('Cidade não encontrada');
        }
        
        const weatherData = await weatherResponse.json();
        
        // Forecast data
        const forecastResponse = await fetch(
            `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
        );
        
        const forecastData = await forecastResponse.json();
        
        displayWeather(weatherData, forecastData);
        showLoading(false);
    } catch (error) {
        showError(error.message);
        showLoading(false);
    }
}

// Display weather data
function displayWeather(data, forecastData) {
    // Current weather
    document.getElementById('cityName').textContent = 
        `${data.name}, ${data.sys.country}`;
    
    const date = new Date();
    document.getElementById('date').textContent = 
        date.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    
    document.getElementById('temperature').textContent = 
        `${Math.round(data.main.temp)}°C`;
    
    document.getElementById('description').textContent = 
        data.weather[0].description.charAt(0).toUpperCase() + 
        data.weather[0].description.slice(1);
    
    document.getElementById('feelsLike').textContent = 
        `Sensação térmica: ${Math.round(data.main.feels_like)}°C`;
    
    // Weather icon
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    document.getElementById('weatherIcon').src = iconUrl;
    
    // Details
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    document.getElementById('visibility').textContent = 
        `${(data.visibility / 1000).toFixed(1)} km`;
    
    // Forecast
    displayForecast(forecastData.list);
    
    // Show content
    weatherContent.style.display = 'block';
    
    // Add to favorites option
    addToFavoritesOption(data.name);
}

// Display 5-day forecast
function displayForecast(forecastList) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';
    
    // Group by day (take one forecast per day at noon)
    const dailyForecasts = [];
    const seenDates = new Set();
    
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toLocaleDateString('pt-BR');
        
        if (!seenDates.has(dateStr) && dailyForecasts.length < 5) {
            seenDates.add(dateStr);
            dailyForecasts.push(item);
        }
    });
    
    dailyForecasts.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
        const temp = Math.round(item.main.temp);
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
        const description = item.weather[0].main;
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="date">${dayName}</div>
            <img class="icon" src="${iconUrl}" alt="${description}">
            <div class="temp">${temp}°C</div>
            <div class="description">${description}</div>
        `;
        
        forecastContainer.appendChild(forecastItem);
    });
}

// Add to favorites
function addToFavoritesOption(city) {
    const favorites = getFavorites();
    
    // Remove old favorite buttons
    const oldBtn = document.querySelector(`[data-city="${city}"]`);
    if (oldBtn) return;
    
    if (!favorites.includes(city)) {
        const btn = document.createElement('button');
        btn.className = 'favorite-btn';
        btn.textContent = `⭐ Adicionar ${city} aos Favoritos`;
        btn.dataset.city = city;
        btn.addEventListener('click', () => {
            addFavorite(city);
            btn.style.display = 'none';
        });
        
        // Insert at the beginning of favorites list
        favoritesList.insertBefore(btn, favoritesList.firstChild);
    }
}

// Local Storage functions
function getFavorites() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

function addFavorite(city) {
    const favorites = getFavorites();
    if (!favorites.includes(city)) {
        favorites.push(city);
        saveFavorites(favorites);
        loadFavorites();
    }
}

function removeFavorite(city) {
    let favorites = getFavorites();
    favorites = favorites.filter(fav => fav !== city);
    saveFavorites(favorites);
    loadFavorites();
}

function loadFavorites() {
    const favorites = getFavorites();
    favoritesList.innerHTML = '';
    
    favorites.forEach(city => {
        const btn = document.createElement('button');
        btn.className = 'favorite-btn';
        btn.innerHTML = `${city} <span style="margin-left: 8px;">✕</span>`;
        
        btn.addEventListener('click', () => {
            fetchWeather(city);
        });
        
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            removeFavorite(city);
        });
        
        favoritesList.appendChild(btn);
    });
}

// Helper functions
function showLoading(show) {
    loadingDiv.style.display = show ? 'block' : 'none';
}

function showError(message) {
    errorDiv.textContent = `❌ Erro: ${message}`;
    errorDiv.style.display = 'block';
    weatherContent.style.display = 'none';
}

function clearError() {
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
}
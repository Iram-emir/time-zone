const API_KEY = 'YOUR_GEOAPIFY_API_KEY';

// Function to get the user's current timezone using Geolocation API
function getUserTimezone() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://api.geoapify.com/v1/timezone?lat=${latitude}&lon=${longitude}&apiKey=${API_KEY}`);
            const data = await response.json();
            displayTimezoneData(data, 'user');
        }, (error) => {
            console.error("Geolocation error:", error);
            document.getElementById('name').textContent = "Unable to retrieve timezone.";
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to display timezone data based on the type (user or result)
function displayTimezoneData(data, type) {
    if (type === 'user') {
        document.getElementById('name').textContent = data.timezone.name || 'N/A';
        document.getElementById('lat').textContent = data.location.lat || 'N/A';
        document.getElementById('long').textContent = data.location.lon || 'N/A';
        document.getElementById('offset-std').textContent = data.timezone.offset_STD || 'N/A';
        document.getElementById('offset-std-seconds').textContent = data.timezone.offset_STD_seconds || 'N/A';
        document.getElementById('offset-dst').textContent = data.timezone.offset_DST || 'N/A';
        document.getElementById('offset-dst-seconds').textContent = data.timezone.offset_DST_seconds || 'N/A';
        document.getElementById('country').textContent = data.country || 'N/A';
        document.getElementById('postcode').textContent = data.postcode || 'N/A';
        document.getElementById('city').textContent = data.city || 'N/A';
    } else if (type === 'result') {
        document.getElementById('result-name').textContent = data.timezone.name || 'N/A';
        document.getElementById('result-lat').textContent = data.location.lat || 'N/A';
        document.getElementById('result-long').textContent = data.location.lon || 'N/A';
        document.getElementById('result-offset-std').textContent = data.timezone.offset_STD || 'N/A';
        document.getElementById('result-offset-std-seconds').textContent = data.timezone.offset_STD_seconds || 'N/A';
        document.getElementById('result-offset-dst').textContent = data.timezone.offset_DST || 'N/A';
        document.getElementById('result-offset-dst-seconds').textContent = data.timezone.offset_DST_seconds || 'N/A';
        document.getElementById('result-country').textContent = data.country || 'N/A';
        document.getElementById('result-postcode').textContent = data.postcode || 'N/A';
        document.getElementById('result-city').textContent = data.city || 'N/A';
        document.getElementById('address-timezone').style.display = 'block';
    }
}

// Function to fetch timezone based on entered address
async function fetchTimezoneByAddress() {
    const address = document.getElementById('address').value.trim();
    if (!address) {
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('address-timezone').style.display = 'none';
        return;
    } else {
        document.getElementById('error-message').style.display = 'none';
    }

    try {
        const geocodeResponse = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${API_KEY}`);
        const geocodeData = await geocodeResponse.json();

        if (geocodeData.features.length === 0) {
            alert("No coordinates found for the entered address.");
            return;
        }

        const { lat, lon } = geocodeData.features[0].properties;
        const timezoneResponse = await fetch(`https://api.geoapify.com/v1/timezone?lat=${lat}&lon=${lon}&apiKey=${API_KEY}`);
        const timezoneData = await timezoneResponse.json();

        displayTimezoneData(timezoneData, 'result');
    } catch (error) {
        console.error("Error fetching timezone:", error);
        document.getElementById('address-timezone').style.display = 'none';
    }
}

// Call the function on page load to get the user's timezone
window.onload = getUserTimezone;

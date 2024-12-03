// // <!-- Add your JavaScript to initialize the map -->


// // Step 2: Initialize the map     
// var map = L.map("map").setView([28.6139, 77.2088], 13); // (latitude, longitude, zoom level)

// // Step 3: Add OpenStreetMap tiles
// L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   maxZoom: 19,
//   attribution:
//     '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
// }).addTo(map);

// // Step 4: Add a marker to the map
// var marker = L.marker([28.6139, 77.2088]).addTo(map);

// // Step 5: Add a popup to the marker
// marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

// // Step 6: Add a circle
// var circle = L.circle([28.6139, 77.2088], {
//   color: "red",
//   fillColor: "#fd5c63",
//   fillOpacity: 0.3,
//   radius: 800,
// }).addTo(map);





// Initialize the map and set a default view
var map = L.map('map').setView([28.6139, 77.2090], 13);  // New Delhi coordinates

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marker;  // To hold the marker on the map

// Function to geocode location and country
function geocodeLocation(location, country) {
    var query = location + ', ' + country;
    var url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                var lat = data[0].lat;
                var lon = data[0].lon;
                
                // Update the map view and place the marker
                map.setView([lat, lon], 13);

                if (marker) {
                    map.removeLayer(marker);  // Remove existing marker if present
                }

                // Add new marker
                marker = L.marker([lat, lon]).addTo(map);
                console.log(marker);
                marker.bindPopup(`<b>${location}, ${country}</b><br>Coordinates: ${lat}, ${lon}`).openPopup();
            } else {
                alert("Location not found. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error fetching geocoding data:", error);
        });
}

// Handling the form submission to extract values
document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();  // Prevent the form from actually submitting

    // Extract the location and country values from the form
    var location = document.querySelector('input[name="listing[location]"]').value;
    var country = document.querySelector('input[name="listing[country]"]').value;

    // Call the geocode function with the form values
    geocodeLocation(location, country);
});


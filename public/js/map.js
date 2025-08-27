/*L = the main Leaflet object
L.map() = create a map
L.tileLayer() = add map tiles (like OpenStreetMap, Mapbox, etc.)
L.marker() = add pins/markers*/
    
if (window.listingData) {
    const { lat, lng, title } = window.listingData;

    let mapLat = isNaN(lat) ? 12.9716 : lat;  // fallback to Bangalore
    let mapLng = isNaN(lng) ? 77.5946 : lng;
    // Create map and set center + zoom
    const map = L.map("map").setView([mapLat, mapLng], 13);

    // Load OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    // Add marker
    L.marker([mapLat, mapLng])
        .addTo(map)
        .bindPopup(title)
        .openPopup();
}

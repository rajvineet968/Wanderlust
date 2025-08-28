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

    //Styling to marker
    const customIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', // green marker earlier if you want to want to change color to any color just edit the url and put whatever color in the color place
        iconSize: [25, 41],  // size of the icon
        iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
        popupAnchor: [1, -34], // point from which the popup should open
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        shadowSize: [41, 41]
        });
    // Add marker
    L.marker([mapLat, mapLng], { icon: customIcon })
        .addTo(map)
        
        .bindPopup(title)//POPUP
        .openPopup();
}

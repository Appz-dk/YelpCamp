mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 7, // starting zoom
});

new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${campground.title}</h5><p>${campground.location}</p>`
    )
  )
  .addTo(map);

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

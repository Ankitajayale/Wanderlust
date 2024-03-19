mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v9",
  center: listing.geometry.coordinates,
  zoom: 8,
});
console.log(listing.geometry.coordinates);

const locationName = listing.location;

const marker = new mapboxgl.Marker({ color: "black" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${locationName}</h4><p>Exact location will be provided after booking</p>`,
    ),
  )
  .addTo(map);



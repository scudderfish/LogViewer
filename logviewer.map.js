function constructMap() {
	if(dataStore.lat==undefined || dataStore.lon==undefined) {
		return;
	}
	if(!(dataStore.map==undefined)) {
		dataStore.map.remove()
	}
	const osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	const osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	const osm = new L.TileLayer(osmUrl, { minZoom: 8, maxZoom: 20, attribution: osmAttrib });	

	let origLat = 51.505;
	let origLon = -0.09;
	for (let i = 0; i < dataStore.lat.length; i++) {
		if(!isNaN(dataStore.lat[i]) && !isNaN(dataStore.lon[i])) {
			origLat=dataStore.lat[i];
			origLon=dataStore.lon[i];
			break;
		}
	}

	dataStore.map=L.map('map').setView([origLat,origLon], 15).addLayer(osm);
	dataStore.marker=L.marker([origLat,origLon]).addTo(dataStore.map)
}

function updateMap(event, x, points, row, seriesName) {
	if(dataStore.lat==undefined || dataStore.lon==undefined) {
		return;
	}

	const lat = dataStore.lat[row]
	const lon = dataStore.lon[row]
	if(!isNaN(lat) && !isNaN(lon)) {
		dataStore.map.panTo([lat,lon])
		dataStore.marker.setLatLng([lat,lon])
	}
}
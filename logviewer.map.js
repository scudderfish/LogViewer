function constructMap() {
	if (dataStore.latIdx == undefined || dataStore.lonIdx == undefined) {
		debugger
		return;
	}
	if(!(dataStore.map==undefined)) {
		dataStore.map.remove()
	}
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 20, attribution: osmAttrib});	

	var origLat=51.505;
	var origLon=-0.09;
	for (var i = 0; i < dataStore.dataSeries.data.length; i++) {
		if (!isNaN(dataStore.dataSeries.data[i][dataStore.latIdx]) && !isNaN(dataStore.dataSeries.data[i][dataStore.lonIdx])) {
			origLat = dataStore.dataSeries.data[i][dataStore.latIdx];
			origLon = dataStore.dataSeries.data[i][dataStore.lonIdx];
			break;
		}
	}

	dataStore.map=L.map('map').setView([origLat,origLon], 15).addLayer(osm);
	dataStore.marker=L.marker([origLat,origLon]).addTo(dataStore.map)
}

function updateMap(event, x, points, row, seriesName) {
	if (dataStore.latIdx == undefined || dataStore.lonIdx == undefined) {
		return;
	}

	const lat = dataStore.dataSeries.data[row][dataStore.latIdx];
	const lon = dataStore.dataSeries.data[row][dataStore.lonIdx];
	if(!isNaN(lat) && !isNaN(lon)) {
		dataStore.map.panTo([lat, lon]);
		dataStore.marker.setLatLng([lat, lon]);
	}
}
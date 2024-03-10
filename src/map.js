
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { dataStore } from './data';


delete L.Icon.Default.prototype._getIconUrl;
 L.Icon.Default.mergeOptions({
   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
   iconUrl: require('leaflet/dist/images/marker-icon.png'),
   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
 });


const map = L.map('right');
const defaultCenter = [38.889269, -77.050176];
const defaultZoom = 15;
const basemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});
const marker = L.marker(defaultCenter);

map.setView(defaultCenter, defaultZoom);

basemap.addTo(map);
marker.addTo(map);


addEventListener("IndexUpdate",e=>{
  console.log(e.detail);
  if(!!dataStore && !!dataStore.lat & !!dataStore.lon) {
    const lat=dataStore.lat[e.detail.dataIndex];
    const lon = dataStore.lon[e.detail.dataIndex];

    if(!isNaN(lat) && !isNaN(lon)) {
      map.panTo([lat,lon])
      marker.setLatLng([lat,lon])
    }
  }


});

console.log("map.js")
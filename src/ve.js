import { dataStore } from './data';


addEventListener("IndexUpdate", e => {
  // const rpm = dataStore.dataSeries["RPM"][e.detail.dataIndex];
  // const yaxis = dataStore.dataSeries[algo][e.detail.dataIndex];
  // const ve = dataStore.dataSeries["VE1"][e.detail.dataIndex];

});
function getBlueGreenRedHSL(value) {
      // Normalize the clamped value within the new range (0-60)
   const normalizedValue = (value-60 ) / 60;
 
   // Calculate base hue based on normalized value
   const baseHue = (normalizedValue * 270)+120;
 
   // Ensure hue stays within 0-360 range
   const hue = (baseHue + 360) % 360;
 
   // Fixed saturation and lightness (adjust as needed)
   const saturation = 100;
   const lightness = 50;
 
   // Combine hue, saturation, and lightness into HSL string format
   const result = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
   return result;
}
 

export function updateTuneData() {

  const old_body = document.getElementById('veTableBody');
  const body = document.createElement('tbody');
  dataStore.veMap.veTable.slice().reverse().forEach((veRow, i) => {
    const row = body.insertRow();

    veRow.forEach((ve, j) => {
      const cell = row.insertCell();
      cell.innerText=ve;
      cell.style.backgroundColor = getBlueGreenRedHSL(ve);
  });
  });
  old_body.parentNode.replaceChild(body, old_body)

}


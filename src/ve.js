import * as echarts from 'echarts';
import 'echarts-gl';
import { tune } from './CurrentTune';
import { dataStore } from './data';



var dom = document.getElementById('left');
var myChart = echarts.init(dom, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app = {};

var option;

const parser = new DOMParser();
const doc = parser.parseFromString(tune, "application/xml");
let veTable=[];
doc.querySelector("constant[name='veTable']").lastChild.data.split("\n").filter(a=>a.length).forEach(e=>{veTable.push(e.trim().split(" ").map(Number))})
veTable=veTable.filter(r=>r.length>2);
let rpmBins = doc.querySelector("constant[name='rpmBins']").lastChild.data.split("\n").map(e=>e.trim()).filter(a=>a.length).map(Number);
let loadBins=doc.querySelector("constant[name='fuelLoadBins']").lastChild.data.split("\n").map(e=>e.trim()).filter(a=>a.length).map(Number);
const algo=doc.querySelector("constant[name='algorithm']").textContent.replaceAll('"','');

console.log(rpmBins);
console.log(loadBins);

const data = [];
veTable.forEach((row,i) => {
  row.forEach((col,j)=> {
    data.push([rpmBins[i],loadBins[j],col])
  })
});
console.log(data);


option = {
  tooltip: {
  },
  backgroundColor: '#fff',
  visualMap: {
    show: false,
    dimension: 2,
    min: 0,
    max: 100,
    inRange: {
      color: [
        '#313695',
        '#4575b4',
        '#74add1',
        '#abd9e9',
        '#e0f3f8',
        '#ffffbf',
        '#fee090',
        '#fdae61',
        '#f46d43',
        '#d73027',
        '#a50026'
      ]
    }
  },
  xAxis3D: {
    type: 'value'
  },
  yAxis3D: {
    type: 'value'
  },
  zAxis3D: {
    type: 'value'
  },
  grid3D: {
    viewControl: {
      // projection: 'orthographic'
    }
  },
  series: [
    {
      type: 'surface',
      wireframe: {
        // show: false
      },
      dataShape:[16,16],
      data:data
    }
  ]
};

if (option && typeof option === 'object') {
  myChart.setOption(option);
}
window.addEventListener('resize', myChart.resize);




addEventListener("IndexUpdate",e=>{
  const rpm = dataStore.dataSeries["RPM"][e.detail.dataIndex];
  const yaxis=dataStore.dataSeries[algo][e.detail.dataIndex];
  const ve=dataStore.dataSeries["VE1"][e.detail.dataIndex];
  myChart.dispatchAction({
    type: 'grid3DShowAxisPointer',
    value:[rpm,yaxis,ve],
    });
  
  
});







import * as echarts from 'echarts';
import 'echarts-gl';
import { tune } from './CurrentTune';
import { dataStore } from './data';



var dom = document.getElementById('left');
var myChart = echarts.init(dom, null, {
  renderer: 'canvas',
  useDirtyRect: false
});

window.addEventListener('resize', myChart.resize);




addEventListener("IndexUpdate", e => {
  const rpm = dataStore.dataSeries["RPM"][e.detail.dataIndex];
  const yaxis = dataStore.dataSeries[algo][e.detail.dataIndex];
  const ve = dataStore.dataSeries["VE1"][e.detail.dataIndex];

  myChart.dispatchAction({
    type: 'grid3DShowAxisPointer',
    value: [rpm, yaxis, ve],
  });


});


export function updateTuneData() {



  const data = [];
  dataStore.veMap.veTable.forEach((row, i) => {
    row.forEach((col, j) => {
      data.push([dataStore.veMap.rpmBins[j], dataStore.veMap.loadBins[i], col])
    })
  });



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
      type: 'category'
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
        dataShape: [16, 16],
        data: data,
      }
    ]
  };

  myChart.setOption(option);

}


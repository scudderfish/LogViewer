import * as echarts from 'echarts';
import { dataStore } from './data';
console.log("chart")

const myChart = echarts.init(document.getElementById('chart-container'));
const option = {
    animation:false,
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'center',
        text: 'Data'
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        // data: date
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
    },
    dataZoom: [
        {
            type: 'inside',
            start: 0,
            end: 100
        },
        {
            start: 0,
            end: 10
        }
    ],
    //   series: [
    //     {
    //       name: 'Fake Data',
    //       type: 'line',
    //       symbol: 'none',
    //       sampling: 'lttb',
    //       itemStyle: {
    //         color: 'rgb(0, 0, 0)'
    //       },
    //       data: data
    //     }
    //   ]
};

option && myChart.setOption(option);

export function updateLineChart(selected) {
    console.log(dataStore);

    console.log(selected);

    const newOptions = {};

    newOptions.xAxis = {
        type: 'category',
        boundaryGap: false,
        data: dataStore.dataSeries.Time
    }
    const series=[];
    const yAxis=[];
    
    selected.filter(s=>!!s).forEach((s,i)=>{
        series.push({
            name:s,
            type:'line',
            symbol: 'none',
            sampling:'lttb',
            data:dataStore.dataSeries[s],
            yAxisIndex:i,
        })
        yAxis.push({
            type:'value',
            name:s,
            alignTicks:true,
            offset:40*i,
            axisLine: {
                show: true,
              },
        })
    })
    newOptions.series=series;
    newOptions.yAxis=yAxis;
    myChart.setOption(newOptions, false, false);
}

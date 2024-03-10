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
        },
        formatter:function(param) {
            let html="";
            param.forEach(e=>{
                html+=`${e.marker} ${e.seriesName} ${e.value} ${e.dataIndex}<br/>`;
            })
            dispatchEvent(new CustomEvent("IndexUpdate",{detail:{dataIndex:param[0].dataIndex,desc:html}}));
            return html;
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
    
};

option && myChart.setOption(option);




export function updateLineChart(selected) {
    // console.log(dataStore);

    // console.log(selected);

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
//            sampling:'lttb',
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

    // myChart.getZr().on('mousemove',function(params){
    //     console.log("mousemove");
    //     console.log(params);
    // })
    // myChart.on('mouseover',function(params){
    //     console.log("mouseover");
    //     console.log(params);
    // })

    // myChart.on('click', function(params) {
    //     // Print name in console
    //     console.log(params.name);
    //   });
}

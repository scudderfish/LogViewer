function getLabels() {
	var labels=[];
	var selects = document.querySelectorAll('.seriesSelect')
	var numSelects=selects.length

	for(var i=0;i<numSelects;i++){
		labels.push(selects[i].value)
	}		
	return labels;
}
function getDiffs(labels) {
	var diffs=[]
  for(var i =0; i<labels.length;i++) {
  	var label = labels[i]
  	var diff=dataStore.dataSeries.maxValues[label]-dataStore.dataSeries.minValues[label]
  	diffs.push(diff)
  }
	
	return diffs;
}

function resetChart() {
	var labels=getLabels();
	
	var series={}
  var diffs=getDiffs(labels)
  
  var mindiff=Math.min.apply(Math, diffs)
  var maxdiff=Math.max.apply(Math, diffs)
  var logdiff=Math.log10(maxdiff)-Math.log10(mindiff)
  if (logdiff>=2) {//We need more axis
	  for(var i =0; i<labels.length;i++) {
	  	var label = labels[i]
	  	series[label]={}
	  	if(dataStore.dataSeries.maxValues[label]>1000) {
	  		series[label]['axis']='y1'
	  	} else {
	  		series[label]['axis']='y2'
	  	}
	  }
  }
  
	
	var times=dataStore.dataSeries[dataStore.dataSeries.XAxis]
	var data=[]	
	for (var i=0;i<dataStore.dataSeries[labels[0]].length;i++) {
		
		var row=[times[i]];
		for(var j=0;j<labels.length;j++) {
			row.push(dataStore.dataSeries[labels[j]][i])
		}
		data.push(row)
	}
	
	
	labels.unshift(dataStore.dataSeries.XAxis)
	
  
 var g = new Dygraph(
        document.getElementById("chartDiv"),  // containing div
        data,
        {
        	width:'100%',
        	showRangeSelector: true,
        	interactionModel: Dygraph.defaultInteractionModel,
        	animatedZooms : true,
        	labels: labels,
        	legend: 'follow',
        	series: series,
        	highlightCallback : updateMap,
        	axes: {
              y: {
                axisLabelWidth: 60
              },
              y2: {
                // set axis-related properties here
                labelsKMB: true
              }
            },
         }                                   // the options
      );
}


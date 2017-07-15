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
	console.log("Reset chart")
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
	  	if(dataStore.dataSeries.maxValues[label]<=1000) {
	  		series[label]['axis']='y2'
	  		console.log('Putting "'+label+'" on y2')
	  	}
	  }
  }


	var times=dataStore.dataSeries[dataStore.dataSeries.XAxis]
	var data=[]
	if(labels.length > 0){
	    var dataSniff = dataStore.dataSeries[labels[0]];
	    if (!(dataSniff === undefined)) {
            for (var i=0;i<dataStore.dataSeries[labels[0]].length;i++) {

                var row=[times[i]];
                for(var j=0;j<labels.length;j++) {
                    var dataSource = dataStore.dataSeries[labels[j]];
                    if(dataSource === undefined) {
                        row.push(null)
                    }
                    else {
                        row.push(dataSource[i])
                    }
                }
                data.push(row)
            }
        }
    }

	labels.unshift(dataStore.dataSeries.XAxis)


 var g = new Dygraph(
        document.getElementById("chart"),  // containing div
        data,
        {
        	width:'100%',
        	showRangeSelector: true,
        	interactionModel: Dygraph.defaultInteractionModel,
        	labels: labels,
        	legend: 'always',
        	labelsSeparateLines: true,
        	series: series,
        	highlightCallback : updateMap,
        	hideOverlayOnMouseOut: false,
        	axes: {
              y: {
                axisLabelWidth: 60
              },
              y2: {
                axisLabelWidth: 60
              }
            },
         }                                   // the options
      );
}



function processWiPyLog(series,data) {
	var minValues={}
	var maxValues={}

	var headers=data[0].split(',')
	var prevValue=[]
	for(var i = 0;i<headers.length;i++) {
		headers[i]=headers[i].trim()

		series[headers[i]]=[];
		prevValue[i]=2000
	}

	for (var i = 1 ; i < data.length;i++) {
		var values=data[i].split(',')
		for (var j=0;j<values.length;j++) {
			var dataPoint=Number(values[j])
			var seriesName=headers[j]
			if(seriesName==="Time") {
				var numMillis=(dataPoint*1000)+946684800000
				dataPoint=new Date(numMillis)
			}
			else{
			    var diff = Math.abs(dataPoint-prevValue[j]);
			    var roc = diff/prevValue[j];

			    if(dataPoint > 20000 || roc > 5) {
				    dataPoint=prevValue[j]
			    }
			}
            prevValue[j]=dataPoint
			series[seriesName].push(dataPoint)
			manageMaxMin(dataPoint,seriesName,maxValues,minValues)
		}
	}

	series.XAxis="Time"
	series.defaultSelections=["28ff00cb721502ea","28ffeb73531502f2"]
	series.headers=headers
	series.maxValues=maxValues
	series.minValues=minValues

	return series

}




function processWiPyLog(series,data) {
	var minValues={}
	var maxValues={}

	var headers=data[0].split(',')
	for(var i = 0;i<headers.length;i++) {
		headers[i]=headers[i].trim()
		
		series[headers[i]]=[];
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
			else if(dataPoint > 20000) {
				dataPoint=null
			}
				
			series[seriesName].push(dataPoint)
			manageMaxMin(dataPoint,seriesName,maxValues,minValues)

		}
	}
	series.XAxis="Time"
	series.defaultSelections=["28ffcf7572150223","28ffeb73531502f2"]
	series.headers=headers
	series.maxValues=maxValues
	series.minValues=minValues

	return series

}

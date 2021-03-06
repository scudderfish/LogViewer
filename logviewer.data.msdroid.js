function processMSDroidLog(series,data) {

	var minValues={}
	var maxValues={}

	var CaptureDateLine=data[1].substr(15,28)
	CaptureDateLine=CaptureDateLine.replace("BST","GMT-1");
	
	var startDate=new Date(CaptureDateLine)
	data.splice(0,2)
	var headers=data[0].split('\t')
	for(var i = 0;i<headers.length;i++) {
		headers[i]=headers[i].trim()
		series[headers[i]]=[];
	}

	for (var i = 1 ; i < data.length;i++) {
		var values=data[i].split('\t')
		if(values.length <headers.length) {
			console.log(data[i]);
			continue
		}

		for (var j=0;j<values.length;j++) {
			
			var seriesName=headers[j]
			var dataPoint=Number(values[j]);

			if(seriesName==="Time") {
				var components=values[j].split('.')
				//dataPoint=getDate(values[j])
				dataPoint=new Date(startDate)
				dataPoint.setSeconds(components[0]);
				dataPoint.setMilliseconds(components[1]);
			}
			manageMaxMin(dataPoint,seriesName,maxValues,minValues)
			series[seriesName].push(dataPoint)
		}
	}
	series.XAxis="Time"
	series.defaultSelections=["RPM","CLT","MAT"]
	series.headers=headers
	series.maxValues=maxValues
	series.minValues=minValues

	return series
	
}


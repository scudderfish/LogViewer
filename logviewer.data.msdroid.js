function processMSDroidLog(series,data) {

	var minValues={}
	var maxValues={}
	var signature = data[0].replace(/"/g,"");
	ga('send','pageview', {'dimension1': signature});
	var CaptureDateLine=data[1].replace(/"/g,'')
	var colonIndex=CaptureDateLine.indexOf(':')
	var dateString = CaptureDateLine.substr(colonIndex+2)
	var dateComponents = dateString.split(' ')
	dateString=dateComponents[0]+' ' +dateComponents[1]+' ' +dateComponents[2]+' ' +dateComponents[3]+' ' +dateComponents[5];
	var startDate=new Date(dateString)
	data.splice(0,2)
	var headers=data[0].split('\t')
	for(var i = 0;i<headers.length;i++) {
		headers[i]=headers[i].trim()
		series[headers[i]]=[];
	}

	for (var i = 1 ; i < data.length;i++) {
		var values=data[i].split('\t')
		if(values.length <headers.length || Number.isNaN(Number.parseFloat(values[0]))) {
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
				var seconds=Number(components[0])
				var millis=Number(components[1])
				if(seconds < 0) { 
					millis=-millis
				}
				dataPoint.setSeconds(seconds);
				dataPoint.setMilliseconds(millis);
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


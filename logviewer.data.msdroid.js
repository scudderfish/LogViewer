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
	while (data[0].indexOf('\t') === -1) {
		data.splice(0, 1)
	}
	const headers = data[0].split('\t')
	series.data = [];

	for (var i = 1 ; i < data.length;i++) {
		var values=data[i].split('\t')
		if(values.length <headers.length || Number.isNaN(Number.parseFloat(values[0]))) {
			console.log(data[i]);
			continue
		}

		const row = [];

		for (var j=0;j<values.length;j++) {

			const seriesName = headers[j]
			let dataPoint = Number(values[j]);

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
			row.push(dataPoint)
		}
		series.data.push(row);
	}
	series.XAxis="Time"
	series.defaultSelections=["RPM","CLT","MAT"]
	series.headers=headers
	series.maxValues=maxValues
	series.minValues=minValues

	return series

}


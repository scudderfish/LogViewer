function processMSDroidLog(series,data) {

	const minValues = {}
	const maxValues = {}

	let CaptureDateLine = data[1].substr(15, 28)
	CaptureDateLine=CaptureDateLine.replace("BST","GMT-1");
	
	const startDate = new Date(CaptureDateLine)

	while (data[0].indexOf('\t') === -1) {
		data.splice(0, 1);
	}


	const headers = data[0].split('\t')
	for (let i = 0; i < headers.length; i++) {
		headers[i]=headers[i].trim()
		series[headers[i]]=[];
	}

	for (let i = 1; i < data.length; i++) {
		const values = data[i].split('\t')
		if(values.length <headers.length) {
			console.log(data[i]);
			continue
		}

		if (isNaN(Number(values[0]))) {
			continue;
		}
		for (let j = 0; j < values.length; j++) {
			
			const seriesName = headers[j]
			let dataPoint = Number(values[j]);

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
	series.defaultSelections = ["RPM", "CLT", "IAT"]
	series.headers=headers
	series.maxValues=maxValues
	series.minValues=minValues

	return series
	
}


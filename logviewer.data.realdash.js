function processRealDashLog(series,data) {

	var minValues={}
	var maxValues={}

	ga('send','pageview', {'dimension1': 'RealDash'});
    var startDate=new Date()
	var headers=data[0].split('\t')
	for(var i = 0;i<headers.length;i++) {
		headers[i]=headers[i].trim()
		series[headers[i]]=[];
	}

	for (var i = 2 ; i < data.length;i++) {
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
	series.defaultSelections=["RPM","Coolant Temperature","Intake Air Temperature"]
	series.headers=headers
	series.maxValues=maxValues
	series.minValues=minValues
    series.latKey='GPS Latitude'
    series.lonKey='GPS Longitude'

	return series

}


var Months = {
	Jan : 0,
	Feb : 1,
	Mar : 2,
	Apr : 3,
	May : 4,
	Jun : 5,
	Jul : 6,
	Aug : 7,
	Sep : 8,
	Oct : 9,
	Nov :10,
	Dec :11
}

function getTorqueTimeStamp(val) {
	//16-Feb-2017 12:39:12.316
	var dttm=val.split(' ')
	var dtcmp=dttm[0].split('-')
	var tmcmp=dttm[1].split(':')
	var millis=tmcmp[2].split('.')[1]
	var day=dtcmp[0]
	var mon=Months[dtcmp[1]]
	var yr=dtcmp[2]
	var hr=tmcmp[0]
	var mn=tmcmp[1]
	var sc=tmcmp[2]
	var dte = new Date(yr,mon,day,hr,mn,sc,millis)
	return dte
}

function processTorqueLog(series,data) {
	var maxValues={}
	var minValues={}

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
			if(!(seriesName=="Longitude" || seriesName=="Latitude")){
				dataPoint=Math.round(dataPoint*1000)/1000
			}
			if(/Device Time$/.test(seriesName)) {
				dataPoint=getTorqueTimeStamp(values[j])
			}
			series[seriesName].push(dataPoint)
			manageMaxMin(dataPoint,seriesName,maxValues,minValues)

		}
	}
	series.XAxis="Device Time"
	series.defaultSelections=["Engine RPM(rpm)","Throttle Position(Manifold)(%)","Intake Manifold Pressure(psi)"]
	series.headers=headers
	series.maxValues=maxValues
	series.minValues=minValues
    series.latKey='Latitude'
    series.lonKey='Longitude'
	return series
}



var LogTypeEnum = {
	Unknown : 0,
	MSDroid : 1,
	Torque : 2,
	WiPy : 3	
}
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

var dataStore={}


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


function sniffData(data) {
	if(data.length > 2) {
		if (data[1].indexOf("Capture Date") == 1) {
			return LogTypeEnum.MSDroid;
		}
		if(data[0].indexOf("GPS Time, Device Time, Longitude, Latitude")==0) {
			return LogTypeEnum.Torque;
		}	
		if(data[0].indexOf("Time,")==0) {
			return LogTypeEnum.WiPy;
		}	
	}
	return LogTypeEnum.Unknown;	
}


function createSeries(data) {
	var series= {};
	series.logType = sniffData(data)
	
	switch(series.logType) {
		case LogTypeEnum.MSDroid:
			processMSDroidLog(series,data)
			break;
			
		case LogTypeEnum.Torque:
			processTorqueLog(series,data)
			break;	
	}
	return series;
}
	
function processMSDroidLog(series,data) {
	var CaptureDateLine=data[1].substr(15,28)
	CaptureDateLine=CaptureDateLine.replace("BST","GMT-1");
	
	var startDate=new Date(CaptureDateLine)
	data.splice(0,2)
	var headers=data[0].split('\t')
	for(var i = 0;i<headers.length;i++) {
		headers[i]=headers[i].trim()
		series[headers[i]]=[];
	}
	var maxValues={}
	var minValues={}

	for (var i = 1 ; i < data.length;i++) {
		var values=data[i].split('\t')
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

			series[seriesName].push(dataPoint)
			
			if (!isNaN(dataPoint)) {
				if(maxValues[seriesName] == undefined || maxValues[seriesName]<dataPoint) {
					maxValues[seriesName]=dataPoint
				}
				if(minValues[seriesName] == undefined || minValues[seriesName]>dataPoint) {
					minValues[seriesName]=dataPoint
				}
			}
		}
	}
	series.XAxis="Time"
	series.defaultSelections=["RPM","CLT","MAT"]
	series.headers=headers
	series.maxValues=maxValues
	series.minValues=minValues

	return series
	
}



function processTorqueLog(series,data) {	
	var headers=data[0].split(',')
	for(var i = 0;i<headers.length;i++) {
		headers[i]=headers[i].trim()
		series[headers[i]]=[];
	}
	var maxValues={}
	var minValues={}
	
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
			if (!isNaN(dataPoint)) {
				if(maxValues[seriesName] == undefined || maxValues[seriesName]<dataPoint) {
					maxValues[seriesName]=dataPoint
				}
				if(minValues[seriesName] == undefined || minValues[seriesName]>dataPoint) {
					minValues[seriesName]=dataPoint
				}
			}
		}
	}
	series.XAxis="Device Time"
	series.defaultSelections=["Engine RPM(rpm)","Throttle Position(Manifold)(%)","Intake Manifold Pressure(psi)"]
	series.headers=headers
	series.maxValues=maxValues
	series.minValues=minValues

	return series
}


function processData(data) {
	var lines = data.split('\n');
	var dataSeries = createSeries(lines)

	var latitudes=dataSeries["Latitude"]
	var longitudes=dataSeries["Longitude"]
	dataStore.lat=latitudes
	dataStore.lon=longitudes
	dataStore.dataSeries=dataSeries
}

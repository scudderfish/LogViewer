

var LogTypeEnum = {
	Unknown : 0,
	MSDroid : 1,
	Torque : 2,
	WiPy : 3	
}

var dataStore={}



function ascertainLogType(data) {
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
	series.logType = ascertainLogType(data)
	
	switch(series.logType) {
		case LogTypeEnum.MSDroid:
			processMSDroidLog(series,data)
			break;
			
		case LogTypeEnum.Torque:
			processTorqueLog(series,data)
			break;	
			
		case LogTypeEnum.WiPy:
			processWiPyLog(series,data)
			break;
			
	}
	return series;
}

function manageMaxMin(value,key,maxValues,minValues) {
	if (!isNaN(value)) {
		if(maxValues[key] == undefined || maxValues[key]<value) {
			maxValues[key]=value
		}
		if(minValues[key] == undefined || minValues[key]>value) {
			minValues[key]=value
		}
	}
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

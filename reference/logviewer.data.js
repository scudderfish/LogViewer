

var LogTypeEnum = {
	Unknown : 0,
	MSDroid : 1,
	Torque : 2,
	WiPy : 3,
	RealDash : 4,
	RPi		 : 5,
	GPX		: 6
}

var dataStore={
	
}



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
		if(data[0].indexOf("Time\tEngine")==0) {
			return LogTypeEnum.RealDash;
		}
		if(data[0].indexOf("LogStart\t")==0) {
			return LogTypeEnum.RPi;
		}
		if(data[0].indexOf("gpx.xsd") != -1) {
			return LogTypeEnum.GPX;
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

		case LogTypeEnum.RealDash:
			processRealDashLog(series,data)
			break;

		case LogTypeEnum.RPi:
			processRPiLog(series,data)
			break;

		case LogTypeEnum.GPX:
			processGPXLog(series,data);
			break;
	}
	return series;
}

function manageMaxMin(value, key, maxValues, minValues) {
    if (!isNaN(value)) {
        const currentMax = maxValues[key];
        const currentMin = minValues[key];

        if ( value > currentMax) {
            maxValues[key] = value;
        }

        if (value < currentMin) {
            minValues[key] = value;
        }
    }
}




function processData(data) {
	var lines = data.split('\n');
	var dataSeries = createSeries(lines)

	var latitudes=dataSeries[dataSeries.latKey || "Latitude"]
	var longitudes=dataSeries[dataSeries.lonKey || "Longitude"]
	dataStore.lat=latitudes
	dataStore.lon=longitudes
	dataStore.dataSeries=dataSeries
}


function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}
function eraseCookie(name) {
	document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
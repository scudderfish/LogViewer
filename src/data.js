import { processMSDroidLog } from "./parsers/msdroid";

export const dataStore={};

const LogTypeEnum = {
	Unknown : 0,
	MSDroid : 1,
	Torque : 2,
	WiPy : 3,
	RealDash : 4,
	RPi		 : 5,
	GPX		: 6
}

export function loadTune(file,updateUI) {
	const reader = new FileReader();
	reader.onload=function (e) {
		processTune(reader.result);
		updateUI();
	}
	reader.readAsText(file);
}
export function loadFile(file,updateUI) {
    const reader = new FileReader();
    reader.onload = function (e) {
        processData(reader.result);
        updateUI()
    }
    reader.readAsText(file);

}

function processTune(tuneText) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(tuneText, "application/xml");
	let veTable = [];
	doc.querySelector("constant[name='veTable']").lastChild.data.split("\n").filter(a => a.length).forEach(e => { veTable.push(e.trim().split(" ").map(Number)); });
	veTable = veTable.filter(r => r.length > 2);
	let rpmBins = doc.querySelector("constant[name='rpmBins']").lastChild.data.split("\n").map(e => e.trim()).filter(a => a.length).map(Number);
	let loadBins = doc.querySelector("constant[name='fuelLoadBins']").lastChild.data.split("\n").map(e => e.trim()).filter(a => a.length).map(Number);
	const algo = doc.querySelector("constant[name='algorithm']").textContent.replaceAll('"', '');
  
  
  const data = [];
  veTable.forEach((row,i) => {
	row.forEach((col,j)=> {
	  data.push([rpmBins[j],loadBins[i],col])
	})
  });
	dataStore.veMap={
		rpmBins,
		loadBins,
		algo,
		veTable
	}  
}

function processData(data) {
	const lines = data.split('\n');
	const dataSeries = createSeries(lines)

	const latitudes=dataSeries[dataSeries.latKey || "Latitude"]
	const longitudes=dataSeries[dataSeries.lonKey || "Longitude"]
	dataStore.lat=latitudes
	dataStore.lon=longitudes
	dataStore.dataSeries=dataSeries
}

function createSeries(data) {
	const series= {};
	series.logType = ascertainLogType(data)

	switch(series.logType) {
		case LogTypeEnum.MSDroid:
			processMSDroidLog(series,data)
			break;
	}
	return series;
}

export function manageMaxMin(value,key,maxValues,minValues) {
	if (!isNaN(value)) {
		if(maxValues[key] == undefined || maxValues[key]<value) {
			maxValues[key]=value
		}
		if(minValues[key] == undefined || minValues[key]>value) {
			minValues[key]=value
		}
	}
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
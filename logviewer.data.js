
var dataStore={}


function getDate(val) {
	//16-Feb-2017 12:39:12.316
	var dttm=val.split(' ')
	var dtcmp=dttm[0].split('-')
	var tmcmp=dttm[1].split(':')
	var millis=tmcmp[2].split('.')[1]
	var day=dtcmp[0]
	var mon=1
	var yr=dtcmp[2]
	var hr=tmcmp[0]
	var mn=tmcmp[1]
	var sc=tmcmp[2]
	var dte = new Date(yr,mon,day,hr,mn,sc,millis)
	return dte
}
function createSeries(data) {
	var series= {};
	headers=data[0].split(',')
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
				var components=values[j].split('.')
				dataPoint=getDate(values[j])
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

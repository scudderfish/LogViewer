
function processRPiLog(series,data) {
	var seriesTranslations={"28.FF00CB721502EA" : "TopHose","28.FFEB73531502F2":"BottomHose"}
	ga('send','pageview', {'dimension1': 'RPi'});

	var minValues={}
	var maxValues={}
	var startDate=new Date(data[0].split('\t')[1])

	data.splice(0,1)

	var headers=data[0].split(',')
	var prevValue=[]
	for(var i = 0;i<headers.length;i++) {
		headers[i]=headers[i].trim()
        headers[i]=seriesTranslations[headers[i]] || headers[i]
		series[headers[i]]=[];
		prevValue[i]=-1e38
	}

	for (var i = 1 ; i < data.length;i++) {
		var values=data[i].split(',')
		for (var j=0;j<values.length;j++) {
			var dataPoint=Number(values[j])
			var seriesName=headers[j]
			if(seriesName==="Time") {
			    dataPoint=new Date(startDate)
				dataPoint.setSeconds(values[j])
			}
			else{
				var cv=dataPoint;
				var pv=prevValue[j]

				if(pv != -1e38 && (cv > pv*2 || cv < pv*0.6)) {
				    dataPoint=prevValue[j]
			    }
			}
            prevValue[j]=dataPoint
			series[seriesName].push(dataPoint)
			manageMaxMin(dataPoint,seriesName,maxValues,minValues)
		}
	}

	series.XAxis="Time"
	series.defaultSelections=["TopHose","BottomHose"]
	series.headers=headers
	series.maxValues=maxValues
	series.minValues=minValues

	return series

}



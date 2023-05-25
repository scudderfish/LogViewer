
let g;

function getLabels() {
	const labels = [];
	const selects = document.querySelectorAll('.seriesSelect')
	const numSelects = selects.length

	for (let i = 0; i < numSelects; i++) {
		const selectedLabel = selects[i].value;

		if (dataStore.dataSeries.headers?.indexOf(selectedLabel) >= 0) {
			labels.push(selectedLabel)
		}
	}
	return labels;
}


function getDiffs(labels) {
	const diffs = []
	for (let i = 0; i < labels.length; i++) {
		const label = labels[i]
		const diff = dataStore.dataSeries.maxValues[label] - dataStore.dataSeries.minValues[label]
		diffs.push(diff)
	}

	return diffs;
}

function resetChart() {
	console.log("Reset chart")
	const labels = getLabels();

	const series = {}
	const diffs = getDiffs(labels)
	const seriesNames = dataStore.dataSeries.headers;

	const mindiff = Math.min.apply(Math, diffs)
	const maxdiff = Math.max.apply(Math, diffs)
	const logdiff = Math.log10(maxdiff) - Math.log10(mindiff)
	if (logdiff >= 2) {//We need more axis
		for (let i = 0; i < seriesNames.length; i++) {
			var label = seriesNames[i]
			series[seriesNames] = {}
			if (dataStore.dataSeries.maxValues[seriesNames] <= 1000) {
				series[label]['axis'] = 'y2'
				console.log('Putting "' + label + '" on y2')
			}
		}
	}




	const options = {
		width: '100%',
		showRangeSelector: true,
		interactionModel: Dygraph.defaultInteractionModel,
		labels: dataStore.dataSeries.headers,
		legend: 'follow',
		series: series,
		highlightCallback: updateMap,
		axes: {
			y: {
				axisLabelWidth: 60
			},
			y2: {
				// set axis-related properties here
				labelsKMB: true
			}
		},
	} // the options


	if (g == null) {
		console.log("Creating g");
		g = new Dygraph(
			document.getElementById("chart"), // containing div
			dataStore.dataSeries.data, options
		);

	} else {
		console.log("Updating g");
		g.updateOptions(options);
	}
	const visibile = [];
	const invisible = [];
	for (let i = 0; i < dataStore.dataSeries.headers.length; i++) {
		const v = labels.indexOf(dataStore.dataSeries.headers[i]) >= 0;
		if (v) {
			visibile.push(i - 1);
		} else {
			invisible.push(i - 1);
		}
	}
	console.log("Setting visibility");
	g.setVisibility(invisible, false);
	g.setVisibility(visibile, true);
	console.log("Done");

}


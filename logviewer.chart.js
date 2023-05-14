function getLabels() {
	var labels = [];
	var selects = document.querySelectorAll('.seriesSelect')
	var numSelects = selects.length

	for (var i = 0; i < numSelects; i++) {
		const selectedLabel = selects[i].value;

		if (!!dataStore.dataSeries[selectedLabel]) {
			labels.push(selectedLabel)
		}
	}
	return labels;
}

function getDiffs(labels) {
	var diffs = []
	for (var i = 0; i < labels.length; i++) {
		var label = labels[i]
		var diff = dataStore.dataSeries.maxValues[label] - dataStore.dataSeries.minValues[label]
		diffs.push(diff)
	}

	return diffs;
}
let g;

function resetChart() {
	const labels = getLabels();

	const series = {}
	const diffs = getDiffs(labels)

	const mindiff = Math.min.apply(Math, diffs)
	const maxdiff = Math.max.apply(Math, diffs)
	const logdiff = Math.log10(maxdiff) - Math.log10(mindiff)
	if (logdiff >= 2) { //We need more axis
		for (var i = 0; i < labels.length; i++) {
			const label = labels[i]
			series[label] = {}
			if (dataStore.dataSeries.maxValues[label] > 1000) {
				series[label]['axis'] = 'y1'
			} else {
				series[label]['axis'] = 'y2'
			}
		}
	}


	const times = dataStore.dataSeries[dataStore.dataSeries.XAxis]
	const data = []
	for (var i = 0; i < dataStore.dataSeries[labels[0]].length; i++) {

		const row = [times[i]];
		for (var j = 0; j < labels.length; j++) {
			const labelIndex = labels[j];
			if (!!dataStore.dataSeries[labelIndex]) {
				row.push(dataStore.dataSeries[labelIndex][i]);
			}
		}
		data.push(row)
	}


	labels.unshift(dataStore.dataSeries.XAxis)


	const options = {
		width: '100%',
		showRangeSelector: true,
		interactionModel: Dygraph.defaultInteractionModel,
		labels: labels,
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
			data, options
		);

	} else {
		console.log("Updating g");
		g.updateOptions(options);
	}
}
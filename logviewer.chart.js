
let g;

function getLabels() {
	const labels = [];
	const selects = document.querySelectorAll('.seriesSelect')
	const numSelects = selects.length

	for (let i = 0; i < numSelects; i++) {
		const selectedLabel = selects[i].value;

		if (!!dataStore.dataSeries[selectedLabel]) {
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
	var labels = getLabels();

	var series = {}
	var diffs = getDiffs(labels)

	var mindiff = Math.min.apply(Math, diffs)
	var maxdiff = Math.max.apply(Math, diffs)
	var logdiff = Math.log10(maxdiff) - Math.log10(mindiff)
	if (logdiff >= 2) {//We need more axis
		for (var i = 0; i < labels.length; i++) {
			var label = labels[i]
			series[label] = {}
			if (dataStore.dataSeries.maxValues[label] <= 1000) {
				series[label]['axis'] = 'y2'
				console.log('Putting "' + label + '" on y2')
			}
		}
	}


	var times = dataStore.dataSeries[dataStore.dataSeries.XAxis]
	var data = []
	if (labels.length > 0) {
		var dataSniff = dataStore.dataSeries[labels[0]];
		if (!(dataSniff === undefined)) {
			for (var i = 0; i < dataStore.dataSeries[labels[0]].length; i++) {

				var row = [times[i]];
				for (var j = 0; j < labels.length; j++) {
					var dataSource = dataStore.dataSeries[labels[j]];
					if (dataSource === undefined) {
						row.push(null)
					}
					else {
						row.push(dataSource[i])
					}
				}
				data.push(row)
			}
		}
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


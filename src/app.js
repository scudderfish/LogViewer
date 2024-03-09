import './map'
import './ve'
import './chart'
import { dataStore, loadFile } from './data';
import { updateLineChart } from './chart';


window.addSeries=function(){
    console.log("Add a series again");
    if (numSeries() < 9) {
        createNewSelector("")
        updateCharts();
    }

}

window.removeSeries=function(){
    if (numSeries() > 1) {
        var selectors = document.querySelectorAll('.seriesSelect');
        var toDie = selectors[selectors.length - 1]
        toDie.parentNode.removeChild(toDie)
        updateCharts();
    }
}

window.updateCharts = function() {
    const selected=[];
    const selectors = document.querySelectorAll('.seriesSelect');
    selectors.forEach(e=>{
        selected.push(e.value);
    });
    updateLineChart(selected);
}
window.onload = function () {
    const fileInput = document.getElementById('fileInput');
    const fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', function (e) {
                    const file = fileInput.files[0];
        loadFile(file,setupSelectors);
    });


}
export function setupSelectors() {
    const selectors = document.querySelectorAll('.seriesSelect');
    for (let i = 0; i < selectors.length; i++) {
        let toDie = selectors[i]
        toDie.parentNode.removeChild(toDie)
    }
    const defaults = JSON.parse(getCookie("selections")) || dataStore.dataSeries.defaultSelections;
    for (let i = 0; i < defaults.length; i++) {
        createNewSelector(defaults[i]);
    }
    updateCharts();
}


function numSeries() {
    return document.querySelectorAll('.seriesSelect').length
}

function setOptions(select, list) {
    while (select.options.length > 0) {
        select.remove(select.options.length - 1);
    }
    for (var i = 0; i < list.length; i++) {
        if (list[i] != 'Time') {
            var opt = document.createElement('option');

            opt.text = list[i];
            opt.value = list[i];

            select.add(opt, null);
        }
    }
}


function createNewSelector(defaultValue) {
    const controls = document.getElementById('controls')
    const select = document.createElement('select')
    select.className = 'seriesSelect';
    setOptions(select, dataStore?.dataSeries?.headers, dataStore)
    if (!(defaultValue == undefined)) {
        select.value = defaultValue;
    }
    select.addEventListener('change', updateCharts)
    controls.appendChild(select)
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
function processGPXLog(series,data) {
    const fullData=data.join('\n');
    const xml=parseXml(fullData);
    const obj=xmlToJson(xml);
    console.log(obj);

    series.Time=[];
    series.speed=[];
    series.lat=[];
    series.lon=[];
    series.ele=[];
    series.sat=[];
    maxValues={};
    minValues={};
    ['speed','lat','lon','ele','sat'].forEach(function(key){
        maxValues[key]=-1e16;
        minValues[key]=1e16;
    });
    obj.gpx.trk.trkseg.trkpt.forEach(function(pt){
        series.Time.push(new Date(pt.time))
        series.speed.push(Number(pt.speed) * 2.237)
        series.lat.push(Number(pt["@attributes"].lat))
        series.lon.push(Number(pt["@attributes"].lon))
        series.ele.push(Number(Number(pt.ele)));
        series.sat.push(Number(Number(pt.sat)));

        ['speed','lat','lon','ele','sat'].forEach(function(key){
            maxValues[key]=Math.max(maxValues[key],series[key][series[key].length-1]);
            minValues[key]=Math.min(maxValues[key],series[key][series[key].length-1]);
        });
    })

    series.XAxis="Time"
	series.defaultSelections=["speed","ele","sat"]
	series.headers=["Time","speed","lat","lon","ele","sat"]
	series.maxValues=maxValues
	series.minValues=minValues
    series.latKey='lat'
    series.lonKey='lon'
	return series

}



function parseXml(xml) {
    var dom = null;
    if (window.DOMParser) {
       try { 
          dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
       } 
       catch (e) { dom = null; }
    }
    else if (window.ActiveXObject) {
       try {
          dom = new ActiveXObject('Microsoft.XMLDOM');
          dom.async = false;
          if (!dom.loadXML(xml)) // parse error ..
 
             window.alert(dom.parseError.reason + dom.parseError.srcText);
       } 
       catch (e) { dom = null; }
    }
    else
       alert("cannot parse xml string!");
    return dom;
 }

// Changes XML to JSON
// Modified version from here: http://davidwalsh.name/convert-xml-json
function xmlToJson(xml) {

	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	// If just one text node inside
	if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
		obj = xml.childNodes[0].nodeValue;
	}
	else if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
}
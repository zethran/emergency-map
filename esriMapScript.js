/**
 * Created by The Doctor on 7/19/2016.
 */
//var map = L.map("map").setView([38.4, -92.3], 7.3);
var map = L.map("map").setView([31.5, -99.9018], 6);
var gauges;
L.esri.basemapLayer("Topographic").addTo(map);

//get hail data and add to map
var hailIcon = L.icon({
    iconUrl: 'mapicons/snowy-2.png',
    iconAnchor: [15.5, 34],
    iconSize: [32, 37],
    popupAnchor: [0, -30]
});

var hailGroup = L.layerGroup();
var standardTime;
var time;
var anotherTime;
function makeTime(time){
    if (time.toString().length == 4){
        standardTime = "" + time.toString().slice(0, 2) + ":" + time.toString().slice(2, 4);
    } else {
        standardTime = "" + time.toString().slice(0, 1) + ":" + time.toString().slice(1, 3);
    }
    return standardTime;
}
function makeStandardTime(rawTime){
    time = rawTime;
if (rawTime>=1300){
    time += -1200;
    anotherTime = makeTime(time) + "pm";
} else if (rawTime<100){
    time += 1200;
    anotherTime = makeTime(time) + "am";
} else {
    anotherTime = makeTime(time) + "pm";
}
    return anotherTime;
}

d3.csv("http://www.spc.noaa.gov/climo/reports/today_hail.csv", function(data) {
    data.forEach(function (d) {
        d.Lat = +d.Lat;
        d.Lon = +d.Lon;
        d.Size = +d.Size;
        d.Time = +d.Time;
    console.log(data);
    data.forEach(function(d){
        makeStandardTime(d.Time);
        var commentsCat = d.Comments.slice(0, -6);
        var hailMarker = L.marker([d.Lat, d.Lon], {icon: hailIcon, riseOnHover: true}).bindPopup("<b><span>Location: </span></b>" + d.Location +
            "<br><b><span>Size: </span></b>" + d.Size +
            "<br><b><span>Time: </span></b>" + anotherTime +
            "<br><b><span>Comments: </span></b>" + commentsCat);
        hailGroup.addLayer(hailMarker);
    });
});
    hailGroup.addTo(map);
    console.log('adding hail');
});

//get data for Wind Speed and add to map
var windMarker;
var windGroup = L.layerGroup();
var windIcon = L.icon({
    iconUrl: 'mapicons/windturbine.png',
    iconAnchor: [15.5, 34],
    iconSize: [32, 37],
    popupAnchor: [0, -30]
});

d3.csv("http://www.spc.noaa.gov/climo/reports/today_wind.csv", function(data){
    data.forEach(function(d){
        d.Lat = +d.Lat;
        d.Lon = +d.Lon;
        d.Time = +d.Time;
        if (d.Speed == 'UNK'){
            d.Speed = 'Unknown';
        } else {
            d.Speed = +d.Speed;
            d.Speed = d.Speed + 'mph';
        }
        windMarker = L.marker([d.Lat, d.Lon], {icon: windIcon, riseOnHover:true});
        makeStandardTime(d.Time);
        var windCommentCat = d.Comments.slice(0, -6);
        windMarker.bindPopup("<b><span>State: </span></b>" + d.State +
            "<br><b><span>County: </span></b>" + d.County +
                "<br><b><span>Location: </span></b>" + d.Location +
        "<br><b><span>Speed: </span></b>" + d.Speed +
        "<br><b><span>Time: </span></b>" + anotherTime +
        "<br><b><span>Comments: </span></b>" + windCommentCat);
        windGroup.addLayer(windMarker);
    });
    console.log(data);
    windGroup.addTo(map);
});

var tornMarker;
var tornGroup = L.layerGroup();
var tornIcon = L.icon({
    iconUrl: 'mapicons/tornado-2.png',
    iconAnchor: [15.5, 34],
    iconSize: [32, 37],
    popupAnchor: [0, -30]
});
d3.csv("http://www.spc.noaa.gov/climo/reports/today_torn.csv", function (data){
    data.forEach(function(d){
        d.Lat = +d.Lat;
        d.Lon = +d.Lon;
        if (d.F_Scale == 'UNK'){
            d.F_Scale = 'Unknown';
        } else {
            d.F_Scale = "F-" + d.F_Scale;
        }
        tornMarker = L.marker([d.Lat, d.Lon], {icon: tornIcon, riseOnHover: true}
        ).bindPopup("<span id='weatherTitle'>Tornado</span><br>" +
            "<br><b><span>State: </span></b>" + d.State +
            "<br><b><span>County: </span></b>" + d.County +
            "<br><b><span>Location: </span></b>" + d.Location +
            "<br><b><span>Intensity: </span></b>" + d.F_Scale +
            "<br><b><span>Time: </span></b>" + anotherTime +
            "<br><b><span>Comments: </span></b>" + d.Comments.slice(0, -6));
        tornGroup.addLayer(tornMarker);
    });
    tornGroup.addTo(map);
    console.log(data);
});

//floods
/*var floodGroup;
function Feature(){
    this.type='Feature';
    this.geometry= new Object;
    this.properties = new Object;
}
function makeGeoJson(data) {
    var output = {
        "type": "FeatureCollection",
        "features": []
    };
    for (i = 0; i < data.features.length; i++) {
        new Feature();
        var coords = {"type" : "Feature",
            "geometry":
        {
            "type":"Point",
                "coordinates":data.features[i].geometry.paths[0][0]
        }};
        output.features.push(coords);
    }
    console.log(output);
    return output;
}
$.getJSON(
    {
        url: 'https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/16/query?where=ELEV%3E9000&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&returnTrueCurves=false&resultOffset=&resultRecordCount=&f=pjson',
        dataType: 'json',
        success: function(data){
            console.log(data);
            floodGroup = L.geoJson(makeGeoJson(data)).addTo(map);
        }}
);*/


//get JSON for rain gauges and add to map
$.getJSON(
    {
    url: "http://magic.csr.utexas.edu/public/views/gauges",
    dataType: "json",
    success: function(data) {
        gauges = L.geoJson(data, {
            pointToLayer: function (point, latlng) {
                return L.circle(latlng, 200);
            }
        }).bindPopup(function (layer) {
                return "<b><span>Location: </span></b>" + layer.feature.properties.location +
                    "<br><span><b>River: </b></span>" + layer.feature.properties.waterbody +
                    "<br><span><b>Observed: </b></span>" + layer.feature.properties.obstime;
            }).addTo(map);
    console.log(data)}
}
);

//get JSON for earthquakes and add to map
var earthquakes;
var earthquakeIcon = L.icon({
    iconUrl: 'mapicons/earthquake-3.png',
    iconAnchor: [15.5, 34],
    iconSize: [32, 37],
    popupAnchor: [0, -30]
});
$.getJSON(
    {
    url: "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
        dataType: "json",
        success: function(data) {
            earthquakes = L.geoJson(data, {
                pointToLayer: function (point, latlng){
                    return L.marker(latlng, {icon: earthquakeIcon})
                }
            }).bindPopup(function (layer) {
                var date = new Date(layer.feature.properties.time);
                return "<b><span>Earthquake</span></b>" +
                        "<br><br><b><span>Location: </span></b>" + layer.feature.properties.place +
                        "<br><span><b>Magnitude: </b></span>" + layer.feature.properties.mag +
                        "<br><span><b>Time: </b></span>" + date
            }).addTo(map);
        console.log(data)}
}
);

var warnings = new Object();

/*$.getJSON(
    {url: 'tl_2015_us_county.json',
        dataType: "json",
        success: function (data) {
        console.log(data);
        }}
);*/



//omnivore.kml('http://trmm.gsfc.nasa.gov/trmm_rain/Events/3B42_rain_accumulation_24hr_b.kml').addTo(map);

//get JSON for rain gauges and add to map
/*var rainGauges;
var rainGaugesIcon = L.icon({
    iconUrl: 'mapicons/rainy.png',
    iconAnchor: [15.5, 34],
    iconSize: [32, 37],
    popupAnchor: [0, -30]
});
$.getJSON(
    {
        url: "http://data.phl.opendata.arcgis.com/datasets/63da9bd382e7497ca8ea8a01683cca6a_0.geojson",
        dataType: "json",
        success: function(data) {
            rainGauges = L.geoJson(data, {
                pointToLayer: function (point, latlng) {
                    return L.marker(latlng, {icon: rainGaugesIcon})
                }
            }).bindPopup(function (att) {
                return "<b><span>Rain</span></b><br><br>" + att.feature.properties.System
            }).addTo(map);
            console.log(data);

        }
    }
);*/

//function to show/hide JSON gauges data
$(function(){
    function showHide(){
        if (map.hasLayer(gauges)) {
            gauges.removeFrom(map);
            console.log("hid gauges");
        } else {
            map.addLayer(gauges);
            console.log("showed gauges");
        }
    }

    $("#showHideButton").on("click",showHide);
});


//function to show/hide CSV hail data
function showHail(){
    if (map.hasLayer(hailGroup)){
        hailGroup.removeFrom(map);
        console.log("hid hail");
    } else {
        hailGroup.addTo(map);
        console.log("showed hail");
    }
}
$("#showHideHail").on("click", showHail);

function showWind(){
    if (map.hasLayer(windGroup)){
        windGroup.removeFrom(map);
        console.log("hid wind");
    } else {
        windGroup.addTo(map);
        console.log("showed wind");
    }
}
$("#showHideWind").on("click", showWind);

function showTorn(){
    if (map.hasLayer(tornGroup)){
        tornGroup.removeFrom(map);
        console.log("hid tornadoes");
    } else {
        tornGroup.addTo(map);
        console.log("showed tornadoes");

    }
}
$("#showHideTorn").on("click", showTorn);
function showEarthquake(){
    if (map.hasLayer(earthquakes)){
        earthquakes.removeFrom(map);
        console.log("hid earthquakes");
    } else {
        earthquakes.addTo(map);
        console.log("showed earthquakes");
    }
}
$("#showHideEarthquake").on("click", showEarthquake);

/**
 * Created by The Doctor on 7/19/2016.
 */
//var map = L.map("map").setView([38.4, -92.3], 7.3);
var map = L.map("map").setView([39, -99.9018], 5);
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
var hailMarker;
var commentsCat;
d3.csv("http://www.spc.noaa.gov/climo/reports/today_hail.csv", function(data) {
    data.forEach(function (d) {
        d.Lat = +d.Lat;
        d.Lon = +d.Lon;
        d.Size = +d.Size;
        d.Time = +d.Time;
        makeStandardTime(d.Time);
        commentsCat = d.Comments.slice(0, -6);
        hailMarker = L.marker([d.Lat, d.Lon], {icon: hailIcon, riseOnHover: true}).bindPopup(
            "<b><span id='header'>Hail</span></b>" +
            "<br><b><span>State: </span></b>" + d.State +
            "<br><b><span>County: </span></b>" + d.County +
            "<br><b><span>Location: </span></b>" + d.Location +
            "<br><b><span>Size: </span></b>" + d.Size +
            "<br><b><span>Time: </span></b>" + anotherTime +
            "<br><b><span>Comments: </span></b>" + commentsCat);
        hailGroup.addLayer(hailMarker);
    });
    hailGroup.addTo(map);
    console.log(data);
    console.log('adding hail');
});

//get data for Damaging Winds and add to map
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
        windMarker.bindPopup("<b><span id='header'>Damaging Winds</span></b><br>" +
            "<b><span>State: </span></b>" + d.State +
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
        ).bindPopup("<b><span id='header'>Tornado</span></b>" +
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
/*
var floodGroup;
function Feature(){
    this.type='Feature';
    this.geometry= new Object;
    this.properties = new Object;
}
function makeGeoJson(data) {
    var point;
    var output = {
        "type": "FeatureCollection",
        "features": []
    };
    for (i = 0; i < data.features.length; i++) {
        new Feature();
        point = [data.features[i].geometry.x, data.features[i].geometry.y];
        var coords = {"type" : "Feature",
            "geometry":
        {
            "type":"Point",
                "coordinates": map.pointToLatLng(point)},
            "properties":{
                "status" : data.features[i].attributes.Status
            }
        };
        output.features.push(coords);
    }
    console.log(output);
    return output;
}
$.getJSON(
    {
        url: 'http://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer/0/query?where=Stage%3E0&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson&__ncforminfo=kG9Xg696oDbr_9KIG8ckbgdp4HSjn_AJdbC1ptUAh3EhBUebzSBKlM5GCXveSsjjPKrjKIGkHERZeHu13LwD4Ll4R8S84xCIyAvG3SNz_GlF4U2RYQ4kPJiVfWmu1ljJ7yzUQTcn8NopBa7moKbpVRfOlGX1DBGX46tgVMqWaNp54i3el1lg7Hn-8FhnAMumiAVrn4r12PsmXSshzlGfYKN3T-LJjagvIz3N19b33CpbjqdecWKwvO0z2I-vYZQLAA7VMqJa1tqJdzUScyM48H9oo0_UwtJwLxJyFwvkym6AkPADZo_cJC6k8vwEX_6EbFwoh2DMaxcGZkkYmGIxzsYMbJUPzIa6ptzIfegn-b0nFoFSr3i3lVJK0Q6gD7uXqAu5t2vvup4aQSEoSpbz2FoaHjV_94KVCs5PhUvbtI1PYmGE3yC9Ml1_eNgu5lKexmVhyQmhGTQjKR0Kv4XzGhQGRrRTITW9JwcapMUvahq1Mn_n6WIMsfIWaSZHHuVfAO8yntRQNF12WHVeg9kK8MfdyTaUyx_Rq9xy73wRexRHJSnQNCRLzQ%3D%3D',
        dataType: 'json',
        success: function(data){
            console.log(data);
            floodGroup = L.geoJson(makeGeoJson(data), {
                pointToLayer: function (point, latlng){
                    return L.marker(latlng);
                }
            }).addTo(map);
        }}
);
*/

//get JSON for rain gauges and add to map
var gaugeIcon = L.icon({
    iconUrl: 'mapicons/river-2.png',
    iconAnchor: [15.5, 34],
    iconSize: [32, 37],
    popupAnchor: [0, -30]
});
$.getJSON(
    {
    url: "http://magic.csr.utexas.edu/public/views/gauges",
    dataType: "json",
    success: function(data) {
        gauges = L.geoJson(data, {
            pointToLayer: function (point, latlng) {
                return L.marker(latlng, {icon: gaugeIcon});
            }
        }).bindPopup(function (layer) {
                return "<b><span id='header'>Rain Gauge</span></b><br>" +
                        "<b><span>State: </span></b>" + layer.feature.properties.state +
            "<br><b><span>Location: </span></b>" + layer.feature.properties.location +
                    "<br><span><b>River: </b></span>" + layer.feature.properties.waterbody +
                        "<br><span><b>Status: </b></span>" + layer.feature.properties.status+
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
                return "<b><span id='header'>Earthquake</span></b>" +
                        "<br><b><span>Location: </span></b>" + layer.feature.properties.place +
                        "<br><span><b>Magnitude: </b></span>" + layer.feature.properties.mag +
                        "<br><span><b>Time: </b></span>" + date
            }).addTo(map);
        console.log(data)}
}
);

function qpfData(){
    document.getElementById("qpf").style.display = "block";
}
$("#qpfButton").on("click", qpfData);

/*$.getJSON(
    {url: 'tl_2015_us_county.json',
        dataType: "json",
        success: function (data) {
        console.log(data);
        }}
);*/



//omnivore.kml('http://trmm.gsfc.nasa.gov/trmm_rain/Events/3B42_rain_accumulation_24hr_b.kml').addTo(map);

//get JSON for rain gauges and add to map
/*
var rainGauges;
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

function showHideQPE(){
    if (document.getElementById("qpe").style.visibility == "visible"){
        document.getElementById("qpe").style.visibility = "hidden";
    } else {
        document.getElementById("qpf").style.visibility = "hidden";
        document.getElementById("qpe").style.visibility = "visible";
    }
}

function showHideQPF(){
    if (document.getElementById("qpf").style.visibility == "visible"){
        document.getElementById("qpf").style.visibility = "hidden";
    } else {
        document.getElementById("qpe").style.visibility = "hidden";
        document.getElementById("qpf").style.visibility = "visible";
    }
}

$("#qpeButton").on("click", showHideQPE);
$("#qpfButton").on("click", showHideQPF);

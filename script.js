L.mapquest.key = 'YCkvK78NdGpW7eQx5LwDX5inOZHxUUsb';
var geo1 = null;
var geo2 = null;
window.onload = function() {
    var map = L.mapquest.map('map', {
      center: [49.9, 2.3],
      layers: L.mapquest.tileLayer('map'),
      zoom: 12
    });

    document.getElementById('buttonOk').addEventListener('click', () => {
        var ville1 = document.getElementById('ville1').value;
        var ville2 = document.getElementById('ville2').value;
        this.myDirection(ville1, ville2);
        this.getGeozoneCode(ville1, ville2);

    }, true);
}

function myDirection(ville1, ville2) {
    var directions = L.mapquest.directions();
    directions.route({
        start: ville1,
        end: ville2
    });
}

function getGeozoneCode(ville1, ville2) {
    var url='http://open.mapquestapi.com/geocoding/v1/address?key=YCkvK78NdGpW7eQx5LwDX5inOZHxUUsb&location='+ ville1 ;
    var url2='http://open.mapquestapi.com/geocoding/v1/address?key=YCkvK78NdGpW7eQx5LwDX5inOZHxUUsb&location='+ ville2 ;
    var request1 = new XMLHttpRequest();
    var request2 = new XMLHttpRequest();
    request1.open('GET', url);
    request2.open('GET', url2);
    request1.responseType = 'json';
    request2.responseType = 'json';
    request1.send();
    request2.send();

    request1.onload = function() {
        geo1 = request1.response.results[0].locations[0].latLng;
        getElevation();
    }

    request2.onload = function() {
        geo2 = request2.response.results[0].locations[0].latLng;
        getElevation();
    }
}

function getElevation() {
    if(geo1 && geo2) {
        var url= 'http://open.mapquestapi.com/elevation/v1/profile?key=YCkvK78NdGpW7eQx5LwDX5inOZHxUUsb&latLngCollection='+geo1.lat+','+geo1.lng+','+geo2.lat+','+geo2.lng;
        console.log(url);
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'json';
        request.send();
    
        request.onload = function() {
            setElevation(request.response);
        }
    }
}

function setElevation(chartJson) {

    console.log(chartJson);

}
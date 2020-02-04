L.mapquest.key = 'YCkvK78NdGpW7eQx5LwDX5inOZHxUUsb';
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
        this.getElevation(ville1, ville2);

    }, true);
}

function myDirection(ville1, ville2) {
    var directions = L.mapquest.directions();
    directions.route({
        start: ville1,
        end: ville2
    });
}

function getElevation(ville1, ville2) {
    var url = 'http://www.mapquestapi.com/directions/v2/route?key=YCkvK78NdGpW7eQx5LwDX5inOZHxUUsb&from='+ville1+'&to='+ville2;console.log(url);
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        var jsonDirection = request.response;
        var villeDepart = jsonDirection.route.locations[0].latLng;
        var villeArrive = jsonDirection.route.locations[1].latLng;
        var passageIntermediaire = jsonDirection.route.legs[0].maneuvers;
        var stringGeoLoc = '' + villeDepart.lat + ',' + villeDepart.lng
        for (var i = 0; i < passageIntermediaire.length; i++) {
            stringGeoLoc = stringGeoLoc + ',' + passageIntermediaire[i].startPoint.lat + ',' + passageIntermediaire[i].startPoint.lng;
        }
        var stringGeoLoc = stringGeoLoc + ',' + villeArrive.lat + ',' + villeArrive.lng;

        setElevation(stringGeoLoc);

    }
}

function setElevation(stringGeoLoc) {
    var url= 'http://open.mapquestapi.com/elevation/v1/chart?key=YCkvK78NdGpW7eQx5LwDX5inOZHxUUsb&latLngCollection='+ stringGeoLoc;
    console.log(url);
    fetch(url)
        .then(res=>{return res.blob()})
        .then(blob=>{
            var img = URL.createObjectURL(blob);
            // Do whatever with the img
            document.getElementById('chart').setAttribute('src', img);
        })
    

}
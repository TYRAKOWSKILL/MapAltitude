L.mapquest.key = 'YCkvK78NdGpW7eQx5LwDX5inOZHxUUsb';
var map = null;
window.onload = function() {

    this.initMap();
    document.getElementById('buttonOk').addEventListener('click', () => {
        var ville1 = document.getElementById('ville1').value;
        var ville2 = document.getElementById('ville2').value;
        if (ville1.toLowerCase() != ville2.toLowerCase()) {
            this.myDirection(ville1, ville2);
            this.getElevation(ville1, ville2);
        } else {
            alert('Veuillez entrer des adresses différentes');
        }
    }, true);
    document.getElementById('buttonClean').addEventListener('click', () => {
        map.remove();
        this.initMap();
        document.getElementById('chart').setAttribute('src', "");
    }, true);
    var placesAutocomplete1 = places({
        appId: 'pl15CLHNX7LN',
        apiKey: 'c7637a953638fb67641497336c9ba7e8',
        container: document.querySelector('#ville1')
    });
    var placesAutocomplete2 = places({
        appId: 'pl15CLHNX7LN',
        apiKey: 'c7637a953638fb67641497336c9ba7e8',
        container: document.querySelector('#ville2')
    });
}

function initMap() {
     map = L.mapquest.map('map', {
        center: [49.9, 2.3],
        layers: L.mapquest.tileLayer('map'),
        zoom: 12
      });
}

function myDirection(ville1, ville2) {
    map.remove();
    this.initMap();
    var directions = L.mapquest.directions();
    directions.route({
        start: ville1,
        end: ville2
    });
}

function getElevation(ville1, ville2) {
    var url = 'http://www.mapquestapi.com/directions/v2/route?key=YCkvK78NdGpW7eQx5LwDX5inOZHxUUsb&from='+ville1+'&to='+ville2;
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
    var url= 'http://open.mapquestapi.com/elevation/v1/chart?key=YCkvK78NdGpW7eQx5LwDX5inOZHxUUsb&shapeFormat=raw&width=800&height=400&latLngCollection='+ stringGeoLoc;
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        var error = request.getResponseHeader("MQ-Error-Message");
        if (error) {
            document.getElementById('chart').setAttribute('src', "");
            alert("La distance est trop grande pour le calcul de l'élévation");
        } else {
            fetch(url)
                .then(res=>{return res.blob()})
                .then(blob=>{
                    var img = URL.createObjectURL(blob);
                    // Do whatever with the img
                    document.getElementById('chart').setAttribute('src', img);
                })
        }
    }
}
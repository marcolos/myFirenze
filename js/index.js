var map;

var lingua = "it";

function initMap() {  // lancia la mappa
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.7695604, lng: 11.25581360000001},
        zoom: 14
    });

    var infoWindow = new google.maps.InfoWindow({map: map}); 

    // Indica la posizione corrente
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var image1='img/poscorrente.png';
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                title: "Posizione corrente",
                icon: image1
            });
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function flagIta()
{
    document.getElementById('ita').src='img/italia.png';
    document.getElementById('eng').src='img/ukbw.jpg';

    lingua = "it";

    initMap();
    inserisciMarkers();
}
function flagEng()
{
    document.getElementById('ita').src = 'img/italiabw.png';
    document.getElementById('eng').src = 'img/uk.jpg';

    lingua = "en";

    initMap();
    inserisciMarkers();
}


function inserisciMarkers() {
    var url = "marker.php?lingua=" + lingua;
    $.get( url, function( data ) {

        var markers = JSON.parse(data); // markers ora è l'array uguale al php. dentro ci sono una lista di coordinate con un nome
        for (var idx in markers) { // inserisco nella mappa ognuno dei markers
            var marker = markers[idx]; // idx è l'indice nell'array
            var name = marker.name;
            var coordinates = marker['coordinate'];
            var lat = coordinates['lat'];
            var lng = coordinates['lng'];

            var pointInterest = new google.maps.Marker({
                position: {lat:  parseFloat(lat), lng:  parseFloat(lng)},
                map: map,
                title: name
            });
        }
    });
}


$( document ).ready(function() {

    var url = "marker.php?lingua=" + lingua;
    $.get( url, function( data ) {
        var markers = JSON.parse(data); // markers ora è l'array uguale al php. dentro ci sono una lista di coordinate con un nome
        for (var idx in markers) { // inserisco nella mappa ognuno dei markers
            var marker = markers[idx]; // idx è l'indice nell'array
            var name = marker.name;
            var coordinates = marker['coordinate'];
            var lat = coordinates['lat'];
            var lng = coordinates['lng'];

            var pointInterest = new google.maps.Marker({
                position: {lat:  parseFloat(lat), lng:  parseFloat(lng)},
                map: map,
                title: name
            });
        }
    });

});



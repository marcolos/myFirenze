var map;
var lingua = "it";

function initMap() {  // lancia la mappa
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.7695604, lng: 11.25581360000001}, //centrata inizialmente
        zoom: 14
    });
}
    // Indica la posizione corrente
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var posCorrente = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var image1='img/poscorrente.png';
            var marker = new google.maps.Marker({
                position: posCorrente,
                map: map,
                title: "Posizione corrente",
                icon: image1
            });
            map.setCenter(posCorrente);
         }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
         });
     } else {
         // Browser doesn't support Geolocation
         handleLocationError(false, infoWindow, map.getCenter());
   }

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function flagIta() {
    var popUp = document.getElementById('descriptor');
    popUp.setAttribute('style', 'display:none;');
    document.getElementById('ita').src='img/italia.png';
    document.getElementById('eng').src='img/ukbw.jpg';

    lingua = "it";

    initMap();
    inserisciMarkers();

}
function flagEng() {
    var popUp = document.getElementById('descriptor');
    popUp.setAttribute('style', 'display:none;');
    document.getElementById('ita').src = 'img/italiabw.png';
    document.getElementById('eng').src = 'img/uk.jpg';

    lingua = "en";

    initMap();
    inserisciMarkers();
    

}


function inserisciMarkers() {
    var url = "marker.php?lingua=" + lingua;
    $.get( url, function(data) {
        var markers = JSON.parse(data); // markers ora è l'array uguale al php. dentro ci sono una lista di coordinate con un nom //decodifica
        
        for (var index in markers) { // inserisco nella mappa ognuno dei markers
            var marker = markers[index];// idx è l'indice nell'array
            var name = marker.name;
            var coordinates = marker['coordinate'];
            var description = marker.description;
            var lat = coordinates['lat'];
            var lng = coordinates['lng'];
            var path = marker.path;
            var pointInterest = new google.maps.Marker({
                position: {lat:  parseFloat(lat), lng:  parseFloat(lng)},
                map: map,
                title: name
            });
            attachMessage(pointInterest, description, path);
        }
    });
}

function attachMessage(marker, description, path) {
    marker.addListener('click', function() {
        var popUp = document.getElementById('descriptor');
        popUp.setAttribute('style','display:block;');
        popUp.children[1].children[0].children[0].textContent = marker.title;
        popUp.children[1].children[0].children[1].textContent = description;
        popUp.children[1].children[1].children[0].setAttribute('src','img/'+ path + '/01.jpg')
    });
}


$(document).ready(function(){

        var closer = document.getElementById('closeDescriptor');
        closer.addEventListener('click', function () {
            var popUp = document.getElementById('descriptor');
            popUp.setAttribute('style', 'display:none;');
        });

    inserisciMarkers();
});









/*var addPlace = document.getElementById('addItinerary');
addPlace.addEventListener('click',function(){
    var posCorrente = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    var pointB = marker['coordinate'];

    calculateAndDisplayRoute(directionsService, directionsDisplay, posCorrente, pointB);

}


function calculateAndDisplayRoute(directionsService, directionsDisplay, posCorrente, pointB) {
    directionsService.route({
        origin: posCorrente,
        destination: pointB,
        avoidTolls: true,
        avoidHighways: false,
        travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });

}*/








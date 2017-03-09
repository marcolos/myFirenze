function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.88, lng: 11.55},
        zoom: 13
    });
    var infoWindow = new google.maps.InfoWindow({map: map});

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent('Your Location');
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
}
function flagEng()
{
    document.getElementById('ita').src = 'img/italiabw.png';
    document.getElementById('eng').src = 'img/uk.jpg';
}


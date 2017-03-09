<<<<<<< Updated upstream
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.88, lng: 11.55},
        zoom: 13
    });
    var infoWindow = new google.maps.InfoWindow({map: map});
=======
function initialize()
{
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(displayLocation);
    }
    else
    {
        alert('Il tuo browser non supporta geolocalizzazione.');
    }
}
function displayLocation (position)
{
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    // chiamiamo createMap con le coordinate della posizione individuata
    createMap(position.coords);
};


function createMap(coords)
{
    var googleCoords = new google.maps.LatLng(coords.latitude, coords.longitude);

    var myOptions =
    {
        zoom: 16,
        center: googleCoords,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR},
        styles:[
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "hue": "#007dff"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "hue": "#ff8800"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "hue": "#edff00"
                    }
                ]
            }
        ]
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

=======
>>>>>>> Stashed changes
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


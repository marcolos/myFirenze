function initialize() {
    var latlng = new google.maps.LatLng(43.7747, 11.25051); // centro della mappa
    // definizione della mappa
    var myOptions = {
        zoom: 16,
        center: latlng,
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

    }
    mymap = new google.maps.Map(document.getElementById("map"), myOptions);
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


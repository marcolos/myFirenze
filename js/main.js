var lingua = "it";
var directionsService; //You can calculate directions (using a variety of methods of transportation) by using the DirectionsService object.
var _mapPoints = new Array();  //Define a variable with all map points.
var _directionsRenderer = '';  //Define a DirectionsRenderer variable.
var map;
function initMap() {  // lancia la mappa
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.7695604, lng: 11.25581360000001}, //centrata inizialmente
        zoom: 14
    });
    directionsService = new google.maps.DirectionsService();
    _directionsRenderer = new google.maps.DirectionsRenderer();   //DirectionsRenderer() is a used to render the direction

    _directionsRenderer.setMap(map);   //Set the map for directionsRenderer


    _directionsRenderer.setOptions({              //Set different options for DirectionsRenderer mehtods //draggable option will used to drag the route.
        draggable: false
    });
    if (_mapPoints.length == 0)
    {
        navigator.geolocation.getCurrentPosition(function(position) {
            var posCorrente = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            var _currentPoints = posCorrente;
            _mapPoints.push(_currentPoints);
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

    changeLang();

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
    document.getElementById('ita').src = 'img/italia.png';
    document.getElementById('eng').src = 'img/ukbw.jpg';

    lingua = "it";

    initMap();
    inserisciMarkers();
    changeLang();

}

function flagEng() {
    var popUp = document.getElementById('descriptor');
    popUp.setAttribute('style', 'display:none;');
    document.getElementById('ita').src = 'img/italiabw.png';
    document.getElementById('eng').src = 'img/uk.jpg';

    lingua = "en";

    initMap();
    inserisciMarkers();
    changeLang();

}

function helpMessage(){
    var helpbutton = document.getElementById("descriptor");
    var content1=document.getElementById("column1");
    var content2=document.getElementById("column2");
    var content3=document.getElementById("helpcontainer");
    helpbutton.setAttribute('style', 'display:block;');
    content1.setAttribute('style', 'display:none;');
    content2.setAttribute('style', 'display:none;');
    content3.setAttribute('style', 'display:block;');
}


function newItinerary(){
    document.getElementById('newItinerary');
    var popUp = document.getElementById('descriptor');
    popUp.setAttribute('style', 'display:none;');
}


function inserisciMarkers()
{
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
function favorite(index)
{
    var url = "favorites.php?lingua=" + lingua;
    $.get( url, function(data) {
        var markers = JSON.parse(data);

        var marker = markers[index];
        var name = marker.name;
        var description = marker.description;
        var path = marker.path;
        var pointInterest = new google.maps.Marker({
            map: map,
            title: name
        });
        var prev = document.getElementById('prev');
        var next = document.getElementById('next');
        var content1=document.getElementById("column1");
        var content2=document.getElementById("column2");
        var content3=document.getElementById("helpcontainer");


        var popUp = document.getElementById('descriptor');
        popUp.setAttribute('style','display:block;');
        popUp.children[1].children[0].children[0].textContent = pointInterest.title;
        popUp.children[1].children[0].children[1].textContent = description;
        popUp.children[1].children[1].children[0].setAttribute('src','img/'+ path + '/01.jpg');

        prev.setAttribute('path', path);
        prev.setAttribute('style','display:none;');
        prev.setAttribute('currentImg', '01');
        next.setAttribute('style','display:inline-block;');

        if(!UrlExists("./img/"+path+"/02.jpg"))
        {
            next.setAttribute('style','display:none;');
            prev.setAttribute('style','display:none;');
        }
        content1.setAttribute('style', 'display:block;');
        content2.setAttribute('style', 'display:block;');
        content3.setAttribute('style', 'display:none;');

    });
}
// CREO LA FINESTRELLA
function attachMessage(marker, description, path) {
    //Quando premo sul marker
    var prev = document.getElementById('prev');
    var next = document.getElementById('next');
    var content1=document.getElementById("column1");
    var content2=document.getElementById("column2");
    var content3=document.getElementById("helpcontainer");

    marker.addListener('click', function() {

        var popUp = document.getElementById('descriptor');
        popUp.setAttribute('style','display:block;');
        popUp.children[1].children[0].children[0].textContent = marker.title;
        popUp.children[1].children[0].children[1].textContent = description;
        popUp.children[1].children[1].children[0].setAttribute('src','img/'+ path + '/01.jpg');

        prev.setAttribute('path', path);
        prev.setAttribute('style','display:none;');
        prev.setAttribute('currentImg', '01');
        next.setAttribute('style','display:inline-block;');

        if(!UrlExists("./img/"+path+"/02.jpg"))
        {
            next.setAttribute('style','display:none;');
            prev.setAttribute('style','display:none;');
        }
        content1.setAttribute('style', 'display:block;');
        content2.setAttribute('style', 'display:block;');
        content3.setAttribute('style', 'display:none;');

        addItinerary(marker);
        removeItinerary(marker);
    });

}
function addItinerary(pos)
{
    var addIt=document.getElementById("addItinerary");
    var _currentPoints;

    addIt.addEventListener("click", function(){
        var addItinerary=document.getElementById("descriptor");
        _currentPoints = pos.position;
        _mapPoints.push(_currentPoints);
        getRoutePointsAndWaypoints();
        addItinerary.setAttribute('style', 'display:none');

    });
}
function removeItinerary(pos)
{
    var remIt=document.getElementById("removeItinerary");

    remIt.addEventListener("click", function(){
        var remItinerary=document.getElementById("descriptor");
        var i = _mapPoints.indexOf();
        deleteLocation(i);
        remItinerary.setAttribute('style', 'display:none');

    });
}
function deleteLocation(i)
{
    if (confirm("Are you sure want to delete this location?") == true)
    {
        var _temPoint = new Array();
        for (var w = 0; w < _mapPoints.length; w++)
        {
            if (i != w)
            {
                _temPoint.push(_mapPoints[w]);
            }
        }

        _mapPoints = new Array();
        for (var y = 0; y < _temPoint.length; y++) {
            _mapPoints.push(_temPoint[y]);
        }

        getRoutePointsAndWaypoints();
    }
    else
    {
        return false;
    }
}
function getRoutePointsAndWaypoints()
{              //getRoutePointsAndWaypoints() will help you to pass points and waypoints to drawRoute() function

    var _waypoints = new Array();       //Define a variable for waypoints.

    if (_mapPoints.length > 2) //Waypoints will be come.
    {
        for (var j = 1; j < _mapPoints.length - 1; j++)
        {
            var address = _mapPoints[j];
            if (address !== "")
            {
                _waypoints.push({
                    location: address,
                    stopover: true       //stopover is used to show marker on map for waypoints
                });
            }
        }
        drawRoute(_mapPoints[0], _mapPoints[_mapPoints.length - 1], _waypoints);        //Call a drawRoute() function
    } else if (_mapPoints.length > 1)
    {
        drawRoute(_mapPoints[_mapPoints.length - 2], _mapPoints[_mapPoints.length - 1], _waypoints);       //Call a drawRoute() function only for start and end locations
    }
    else
    {
        drawRoute(_mapPoints[_mapPoints.length - 1], _mapPoints[_mapPoints.length - 1], _waypoints);       //Call a drawRoute() function only for one point as start and end locations.
    }
}


function drawRoute(originAddress, destinationAddress, _waypoints)       //drawRoute() will help actual draw the route on map.
{

    var _request = '';         //Define a request variable for route.


    if (_waypoints.length > 0)      //This is for more then two locatins
    {
        _request = {
            origin: originAddress,
            destination: destinationAddress,
            waypoints: _waypoints,              //an array of waypoints
            optimizeWaypoints: true,          //set to true if you want google to determine the shortest route or false to use the order specified.
            travelMode: google.maps.DirectionsTravelMode.WALKING

        };
    }
    else
    {
        _request = {          //This is for one or two locations. Here noway point is used
            origin: originAddress,
            destination: destinationAddress,
            travelMode: google.maps.DirectionsTravelMode.WALKING
        };
    }


    directionsService.route(_request, function (_response, _status)
    {           //This will take the request and draw the route and return response and status as output
        if (_status == google.maps.DirectionsStatus.OK)
        {
            _directionsRenderer.setDirections(_response);
        }
    });
}

$(document).ready(function(){
    inserisciMarkers();
});

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}
function slideShows(index)
{
    var prev = document.getElementById('prev');
    var next = document.getElementById('next');
    var folderPath = prev.getAttribute('path');
    var currentImg = prev.getAttribute("currentImg");
    var image = document.getElementById('previewImage');
    var countImg=parseInt(currentImg)+index;
    var path;

        if(countImg > 9)
        {
            currentImg = countImg;
        }
        else
        {
            currentImg = "0"+ countImg;
        }

        path = "./img/"+folderPath+"/"+currentImg+".jpg";

        if(UrlExists(path))
        {
            image.setAttribute('src', path);
            prev.setAttribute('currentImg', currentImg);
        }

        countImg=parseInt(currentImg)+index;
        if(index==1)
        {
            prev.setAttribute('style','display:inline-block;');
            if(countImg > 9)
            {
                currentImg = countImg;
            }
            else
            {
                currentImg = "0"+ countImg;
            }
            path = "./img/"+folderPath+"/"+currentImg+".jpg";
            if(!UrlExists(path)){//next
                next.setAttribute('style','display:none;');
            }
        }
        if(index==-1)
        {
            next.setAttribute('style', 'display:inline-block;');
            if(countImg > 9)
            {
                currentImg = countImg;
            }
            else
            {
                currentImg = "0"+ countImg;
            }
            path = "./img/"+folderPath+"/"+currentImg+".jpg";
            if(!UrlExists(path)){//next
                prev.setAttribute('style','display:none;');
            }

        }

}

function changeLang(){
    var url = "favorites.php?lingua=" + lingua;
    $.get( url, function(data)
    {
        var markers = JSON.parse(data);
        var itinerary = document.getElementById('descriptor');
        var helpsMe = document.getElementById('help');
        var nwItinerary = document.getElementById('newItinerary');
        var favorite = document.getElementById('best');
        var fav1 = document.getElementById('fav1');
        var fav2 = document.getElementById('fav2');
        var fav3 = document.getElementById('fav3');
        var fav4 = document.getElementById('fav4');
        var fav5 = document.getElementById('fav5');
        var fav6 = document.getElementById('fav6');
        var fav7 = document.getElementById('fav7');
        var fav8 = document.getElementById('fav8');
        helpsMe.setAttribute('style', 'font-size:17px; font-style:bold;');
        nwItinerary.setAttribute('style', 'font-size:17px; font-style:bold;');

        if (lingua == 'it') {
            itinerary.children[1].children[0].children[2].textContent = "Aggiungi all'itinerario +";
            itinerary.children[1].children[0].children[3].textContent = "Rimuovi dall'itineraro -";
            helpsMe.textContent = "AIUTO";
            nwItinerary.textContent = "NUOVO ITINERARIO";
            favorite.textContent = "Preferiti";
            fav1.textContent=markers[0].name;
            fav2.textContent=markers[1].name;
            fav3.textContent=markers[2].name;
            fav4.textContent=markers[3].name;
            fav5.textContent=markers[4].name;
            fav6.textContent=markers[5].name;
            fav7.textContent=markers[6].name;
            fav8.textContent=markers[7].name;
        }
        else {
            itinerary.children[1].children[0].children[2].textContent = "Add to itinerary +";
            itinerary.children[1].children[0].children[3].textContent = "Remove from itinerary -";
            helpsMe.textContent = "HELP";
            nwItinerary.textContent = "NEW ITINERARY";
            favorite.textContent = "Favorites";
            fav1.textContent=markers[0].name;
            fav2.textContent=markers[1].name;
            fav3.textContent=markers[2].name;
            fav4.textContent=markers[3].name;
            fav5.textContent=markers[4].name;
            fav6.textContent=markers[5].name;
            fav7.textContent=markers[6].name;
            fav8.textContent=markers[7].name;

        }
    });

}
function hidepopup()
{
    document.getElementById('descriptor').setAttribute('style', 'display:none');
}







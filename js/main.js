var map;
var lingua = "it";

function initMap() {  // lancia la mappa
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.7695604, lng: 11.25581360000001}, //centrata inizialmente
        zoom: 14
    });
    changeLang();

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
    var helpMe=document.getElementById('help');
    helpMe.addListener('click',function(){
    helpMe.setAttribute('style','display:block;');
    helpMe.firstElementChild.textContent='AIUTO';

    });
}


function newItinerary(){
    document.getElementById('newItinerary');
    var popUp = document.getElementById('descriptor');
    popUp.setAttribute('style', 'display:none;');
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

// CREO LA FINESTRELLA
function attachMessage(marker, description, path) {
    //Quando premo sul marker
    var prev = document.getElementById('prev');
    var next = document.getElementById('next');

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
    var itinerary = document.getElementById('descriptor');
    var helpsMe = document.getElementById('help');
    var nwItinerary = document.getElementById('newItinerary');
    helpsMe.setAttribute('style', 'font-size:17px; font-style:bold;');
    nwItinerary.setAttribute('style', 'font-size:17px; font-style:bold;');

    if (lingua=='it'){
        itinerary.children[1].children[0].children[2].textContent="Aggiungi all'itinerario +";
        itinerary.children[1].children[0].children[3].textContent="Rimuovi dall'itineraro -";
        helpsMe.textContent= "AIUTO";
        nwItinerary.textContent = "NUOVO ITINERARIO";
    }
    else{
        itinerary.children[1].children[0].children[2].textContent="Add to itinerary +";
        itinerary.children[1].children[0].children[3].textContent="Remove from itinerary -";
        helpsMe.textContent= "HELP";
        nwItinerary.textContent= "NEW ITINERARY";

    }

}

/*function changeLang1(){

    var helpsMe = document.getElementById('help');
    var nwItinerary = document.getElementById('newItinerary');
    helpsMe.setAttribute('style', 'font-size:17px; font-style:bold;');
    nwItinerary.setAttribute('style', 'font-size:17px; font-style:bold;');
    if (lingua=='it'){
        helpsMe.textContent= "AIUTO";
        nwItinerary.textContent = "NUOVO ITINERARIO";
    }
    else{
        helpsMe.textContent= "HELP";
        nwItinerary.textContent= "NEW ITINERARY";
    }

}*/



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








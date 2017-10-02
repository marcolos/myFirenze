var lingua = "it";
var directionsService; //You can calculate directions (using a variety of methods of transportation) by using the DirectionsService object.
var _mapPoints = {};  //Define a variable with all map points.
_mapPoints.length = 0;
var _directionsRenderer = '';  //Define a DirectionsRenderer variable.
var map;
var timeVisit = 0;
var itinerario = [];
var swap1=-1;
var swap2=-1;
var totTime = 0;

var endPoint = "http://localhost:8080/myFirenze/index.php?";

var l = 0; // serve per l'UUID da generare

function initMap() {  // lancia la mappa

    loadItinerario();

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.7695604, lng: 11.25581360000001}, // centrata inizialmente
        zoom: 14
    });

    directionsService = new google.maps.DirectionsService();
    _directionsRenderer = new google.maps.DirectionsRenderer();   //DirectionsRenderer() is a used to render the direction
    _directionsRenderer.setMap(map);   // Set the map for directionsRenderer

    _directionsRenderer.setOptions({              //Set different options for DirectionsRenderer methods //draggable option will used to drag the route.
        suppressMarkers: true

    });

    // Indica la posizione corrente
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function(position)
        {
            var posCorrente = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };


            var image1='img/position.png';
            var marker = new google.maps.Marker({
                position: posCorrente,
                map: map,
                title: "Posizione corrente",
                icon: image1
            });
            map.setCenter(posCorrente);
            if (_mapPoints.length === 0) {
                    _mapPoints[0] = posCorrente;
                    _mapPoints.length = 1;
            }
            reinsertItinerary();
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
function flagIta()
{
    var popUp = document.getElementById('descriptor');
    popUp.setAttribute('style', 'display:none;');
    var time = document.getElementById('right');
    time.textContent = "";
    var time2 = document.getElementById('time');
    time2.textContent = "";
    document.getElementById('ita').src = 'img/it.png';
    document.getElementById('eng').src = 'img/enbw.png';
    _mapPoints = {};
    _mapPoints.length = 0;
    l=0;
    timeVisit = 0;
    itinerario = [];
    itinerario.length=0;
    swap1=-1;
    swap2=-1;
    totTime=0;

    lingua = "it";

    initMap();
    inserisciMarkers();
    changeLang();

}



function flagEng()
{
    var popUp = document.getElementById('descriptor');
    var time1 = document.getElementById('right');
    time1.textContent = "";
    var time2 = document.getElementById('time');
    time2.textContent = "";
    popUp.setAttribute('style', 'display:none;');
    document.getElementById('ita').src = 'img/itbw.png';
    document.getElementById('eng').src = 'img/en.png';

    _mapPoints = {};
    _mapPoints.length = 0;
    l=0;
    timeVisit = 0;
    itinerario = [];
    itinerario.length=0;
    swap1=-1;
    swap2=-1;
    totTime=0;

    lingua = "en";

    initMap();
    inserisciMarkers();
    changeLang();

}

function helpMessage()
{
    var helpbutton = document.getElementById("descriptor");
    var content1=document.getElementById("column1");
    var content2=document.getElementById("column2");
    var content3=document.getElementById("helpcontainer");
    helpbutton.setAttribute('style', 'display:block;');
    content1.setAttribute('style', 'display:none;');
    content2.setAttribute('style', 'display:none;');
    content3.setAttribute('style', 'display:block;');
}


function newItinerary()
{
    var popUp = document.getElementById('descriptor');
    popUp.setAttribute('style', 'display:none;');
    var time1 = document.getElementById('right');
    time1.textContent = "";
    var time2 = document.getElementById('time');
    time2.textContent = "";
    _mapPoints = {};
    _mapPoints.length = 0;
    l=0;
    timeVisit = 0;
    itinerario = [];
    itinerario.length=0;
    totTime=0;
    initMap();
    inserisciMarkers();
}


function inserisciMarkers()
{
    var url = "marker.php?lingua=" + lingua;
    $.get( url, function(data) {  // attraverso il get faccio una richiesta a markers.php. Dentro data ho la risposta del php
        var markers = JSON.parse(data); // markers ora è l'array uguale al php(vedi marker.php). Siccome php genera ed invia codice in formato JSON, con il parse viene decifrato per essere leggibile al javascript

    $.get( url, function(data) {
        var markers = JSON.parse(data); // markers ora è l'array uguale al php. dentro ci sono una lista di coordinate con un nom //decodifica

        for (var index in markers) { // inserisco nella mappa ognuno dei markers
            var marker = markers[index];// index è l'indice nell'array
            var name = marker.name;
            var coordinates = marker['coordinate'];
            var description = marker.description;
            var lat = coordinates['lat'];
            var lng = coordinates['lng'];
            var path = marker.path;
            var duration = marker.duration;
            var pointInterest = new google.maps.Marker({
                position: {lat:  parseFloat(lat), lng:  parseFloat(lng)},
                map: map,
                title: name,
                icon: "img/markers.png"
            });
            var data = {
                position: {lat:  parseFloat(lat), lng:  parseFloat(lng)},
                name: name
            };
            attachMessage(pointInterest, data, description, path, duration);

        }
    });
});
}
function favorite(index)
{
    var url = "favorites.php?lingua=" + lingua;
    $.get( url, function(data) {
        var markers = JSON.parse(data);

        var marker = markers[index];
        var name = marker.name;
        var coordinates = marker['coordinate'];
        var lat = coordinates['lat'];
        var lng = coordinates['lng'];
        var description = marker.description;
        var path = marker.path;
        var duration = marker.duration;
        var pointInterest = new google.maps.Marker({
            map: map,
            title: name
        });
        var data = {
            position: {lat:  parseFloat(lat), lng:  parseFloat(lng)},
            name: name
        };
        var prev = document.getElementById('prev');
        var next = document.getElementById('next');
        var content1=document.getElementById("column1");
        var content2=document.getElementById("column2");
        var content3=document.getElementById("helpcontainer");


        var popUp = document.getElementById('descriptor');
        popUp.setAttribute('style','display:block;');
        popUp.children[1].children[0].children[0].textContent = pointInterest.title;
        popUp.children[1].children[0].children[1].textContent = description;
        popUp.children[1].children[0].children[4].children[1].textContent = duration + " min";
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

        popUp.setAttribute('name', data.name);
        popUp.setAttribute('lat', data.position.lat);
        popUp.setAttribute('lng',data.position.lng);
        popUp.setAttribute('duration', duration);
    });
}
// CREO LA FINESTRELLA
function attachMessage(marker, data, description, path, duration) {
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
        popUp.children[1].children[0].children[4].children[1].textContent = duration + " min";
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

        popUp.setAttribute('name', data.name);
        popUp.setAttribute('lat', data.position.lat);
        popUp.setAttribute('lng',data.position.lng);
        popUp.setAttribute('duration', duration);
    });


}

function getRoutePointsAndWaypoints()    //getRoutePointsAndWaypoints() will help you to pass points and waypoints to drawRoute() function
{
    var _waypoints = new Array();       //Define a variable for waypoints.

    if (_mapPoints.length > 2)
        {
        for(var uuid in _mapPoints)
        {
            if(_mapPoints.hasOwnProperty(uuid) && uuid !== 'length'){
                var address = _mapPoints[uuid];
                if (address !== "") {
                    _waypoints.push({
                        location: address,
                        stopover: false  //stopover is used to show marker on map for waypoints
                    });
                }
            }
        }
        //Call a drawRoute() function
        drawRoute(_mapPoints[0], _mapPoints[lastIndex(_mapPoints)], _waypoints);
    } else if(_mapPoints.length === 2){
        drawRoute(_mapPoints[0], _mapPoints[lastIndex(_mapPoints)], _waypoints);
    } else if(_mapPoints.length < 2){
        newItinerary();
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
            //_response.routes[0].bounds = [];
            //setMapOnAll(null);
            _directionsRenderer.setDirections(_response);
        }
    });
}

$(document).ready(function(){

    inserisciMarkers();

    var addIt=document.getElementById("addItinerary");
    var tVisit = document.getElementById('right');
    addIt.addEventListener("click", function(){

        console.log(_mapPoints[0]);

        var app=0;
        var addItinerary = document.getElementById("descriptor");
        for (var i=0; i<itinerario.length; i++)
        {
            if(addItinerary.getAttribute('name')==itinerario[i])
            {
                app=1;
            }
        }
        if(app==0)
        {
            if(_mapPoints.length > 0) {


                var data = {
                    lat: parseFloat(addItinerary.getAttribute('lat')),
                    lng: parseFloat(addItinerary.getAttribute('lng'))
                };

                itinerario.push(addItinerary.getAttribute('name'));
                loadItinerario();

                _mapPoints[generateUUID()] = data;
                _mapPoints.length = _mapPoints.length + 1;
                getRoutePointsAndWaypoints();
                addItinerary.setAttribute('style', 'display:none');
                timeVisit= parseInt(timeVisit) + parseInt(addItinerary.getAttribute('duration'));
                tVisit.textContent = marco(timeVisit);
                totTime=0;
                computeDuration();
                console.log(totTime);


            }
            else {
                alert('Aspetta il caricamento della tua posizione corrente / Wait the loading of your current position');
            }
        }
        else
        {
            addItinerary.setAttribute('style', 'display:none');
            if (lingua== 'it')
            {
                alert(addItinerary.getAttribute('name') + ' è già stato aggiunto al percorso');
            }
            else
            {
                alert(addItinerary.getAttribute('name') + ' is already on the itinerary');
            }
        }

    });

    var remIt=document.getElementById("removeItinerary");

    remIt.addEventListener("click", function(){

        var remItinerary = document.getElementById("descriptor");
        remItinerary.setAttribute('style', 'display:none');
        //find id
        var data = {
            lat: parseFloat(remItinerary.getAttribute('lat')),
            lng: parseFloat(remItinerary.getAttribute('lng'))
        };

        var indexToRemove = itinerario.indexOf(remItinerary.getAttribute('name'));
        itinerario = removeFromArray(itinerario, indexToRemove);
        loadItinerario();

        var elem = -1;

        for(var uuid in _mapPoints)
        {
            if(_mapPoints.hasOwnProperty(uuid) && uuid !== 'length'){
                var address = _mapPoints[uuid];
                if (address.lat == data.lat && address.lng == data.lng)
                {
                    elem = uuid;
                    _mapPoints.length = _mapPoints.length -1;
                    timeVisit= parseInt(timeVisit) - parseInt(remItinerary.getAttribute('duration'));
                    if (timeVisit < 0)
                    {
                        timeVisit = 0;
                        tVisit.textContent = "";
                    }
                    else
                    {
                        tVisit.textContent = marco(timeVisit);
                    }
                }
            }
        }
        _mapPoints = deleteElement(_mapPoints, elem);
        getRoutePointsAndWaypoints();
        totTime=0;
        computeDuration();
    });
});

function deleteElement(_mapPoints, key) {
    var newObj = {};
    for(var uuid in _mapPoints){
        if(_mapPoints.hasOwnProperty(uuid) && uuid !== key){
            newObj[uuid] = _mapPoints[uuid];
        }
    }
    return newObj;
}

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
        var currentItinerary = document.getElementById('currentItinerary');
        var fav1 = document.getElementById('fav1');
        var fav2 = document.getElementById('fav2');
        var fav3 = document.getElementById('fav3');
        var fav4 = document.getElementById('fav4');
        var fav5 = document.getElementById('fav5');
        var fav6 = document.getElementById('fav6');
        var fav7 = document.getElementById('fav7');
        var fav8 = document.getElementById('fav8');
        var timeVisit = document.getElementById('left');
        var googleTime = document.getElementById('info');
        helpsMe.setAttribute('style', 'font-size:17px; font-style:bold;');
        nwItinerary.setAttribute('style', 'font-size:17px; font-style:bold;');

        if (lingua == 'it') {
            itinerary.children[1].children[0].children[2].textContent = "Aggiungi all'itinerario +";
            itinerary.children[1].children[0].children[3].textContent = "Rimuovi dall'itineraro -";
            itinerary.children[1].children[0].children[4].children[0].textContent = "Tempo di visita: ";
            itinerary.children[1].children[2].textContent = "Benvenuti in MyFirenze! Questa piattaforma mette a vostra disposizione la possibilità di creare un itinerario per visitare la città di Firenze. "  +
                "Cliccare sui markers per aprire la finestra descrittiva del luogo. " +
                "Aggiunta luogo: premendo il pulsante verde “Aggiungi all’itinerario” potete aggiungere il luogo alla lista che verrà visualizzata nella finestra itinerario. " +
                "Rimozione luogo : premere il pulsante rosso “Rimuovi dall'itinerario. " +
            "Swap lista : una volta creata la lista è possibile cambiare l'ordine tramite trascinamento. " +
            "Tempo visita: tempo necessario solo per visitare i luoghi selezionati. " +
                "Tempo totale: oltre al tempo di visita comprende anche quello necessario per percorrere l’itinerario. ";
            helpsMe.textContent = "AIUTO";
            nwItinerary.textContent = "NUOVO ITINERARIO";
            favorite.textContent = "Luoghi famosi";
            currentItinerary.textContent = "Itinerario";
            timeVisit.textContent = "Tempo di visita: ";
            googleTime.textContent = "Tempo totale: ";
            fav1.textContent=markers[0].name;
            fav2.textContent=markers[1].name;
            fav3.textContent=markers[2].name;
            fav4.textContent=markers[3].name;
            fav5.textContent=markers[4].name;
            fav6.textContent=markers[5].name;
            fav7.textContent=markers[6].name;
            fav8.textContent=markers[7].name;
        }
        else
        {
            itinerary.children[1].children[0].children[2].textContent = "Add to itinerary +";
            itinerary.children[1].children[0].children[3].textContent = "Remove from itinerary -";
            itinerary.children[1].children[0].children[4].children[0].textContent = "Time of visit: ";
            itinerary.children[1].children[2].textContent = "Welcome in MyFirenze! This site offers you the possibility to create your own itinerary for visit the city of Florence. " +
            "Click on the red markers to visualize the window with the description of each place. " +
            "Adding a place: click on the green button “Add to itinerary” to add a place in your list. " +
            "Removing a place: click on the red button “Remove from itinerary” to remove a place from your list. " +
            "Swap: once the list is created, it will be displayed in the window on the right. You can change its order just swapping between the places. " +
            "Time of visit: the time needed to only visit the places. " +
            "Total time : the time needed to visit the places and travel(by walk) between them. ";
            helpsMe.textContent = "HELP";
            nwItinerary.textContent = "NEW ITINERARY";
            favorite.textContent = "Famous places";
            currentItinerary.textContent = "Itinerary";
            timeVisit.textContent = "Time of visit: ";
            googleTime.textContent = "Total time: ";
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
    document.getElementById('descriptorQR').setAttribute('style', 'display:none');
}

function generateUUID() {
    l = l+1;
    return l;
    //var d = new Date().getTime();
    //var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    //    var r = (d + Math.random()*16)%16 | 0;
    //    d = Math.floor(d/16);
    //    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    //});
    //return uuid;
};

function lastIndex(obj) {
    var keys = Object.keys(obj);
    return parseInt(keys[keys.length-2]);
}
function loadItinerario()
{
    var ul = document.getElementById("menuItinerary");
    ul.innerHTML = '';

    for(var i=0; i<itinerario.length; i++){
        var li = document.createElement("li");
        li.setAttribute("class", "listElements");
        li.setAttribute("order", ""+i);
        li.setAttribute("name", itinerario[i]);
        var b = document.createElement("div");
        var a = document.createElement("div");
        b.appendChild(document.createTextNode(i+1 + ') ' + itinerario[i]));
        b.setAttribute("class", "changeIt");
        b.setAttribute("draggable", true);
        a.appendChild(document.createTextNode("+"));
        a.setAttribute("class", "openPopUp");

        ul.appendChild(li);
        li.appendChild(b);
        li.appendChild(a);

        info(li,a);
    }
    var cols = document.querySelectorAll('#menuItinerary .listElements');
    [].forEach.call(cols, addDnDHandlers);
}
function info(li,a)
{
    a.addEventListener('click', function(){

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
                var duration = marker.duration;
                var pointInterest = new google.maps.Marker({
                    position: {lat:  parseFloat(lat), lng:  parseFloat(lng)},
                    map: map,
                    title: name,
                    icon: "img/markers.png"
                });
                var data = {
                    position: {lat:  parseFloat(lat), lng:  parseFloat(lng)},
                    name: name
                };

                if (li.getAttribute("name")== name)
                {
                    var prev = document.getElementById('prev');
                    var next = document.getElementById('next');
                    var content1=document.getElementById("column1");
                    var content2=document.getElementById("column2");
                    var content3=document.getElementById("helpcontainer");

                    var popUp = document.getElementById('descriptor');
                    popUp.setAttribute('style','display:block;');
                    popUp.children[1].children[0].children[0].textContent = name;
                    popUp.children[1].children[0].children[1].textContent = description;
                    popUp.children[1].children[0].children[4].children[1].textContent = duration + " min";
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

                    popUp.setAttribute('name', data.name);
                    popUp.setAttribute('lat', data.position.lat);
                    popUp.setAttribute('lng',data.position.lng);
                    popUp.setAttribute('duration', duration);

                    break;
                }
            }
        });
    });
}

var dragSrcEl = null;

function handleDragStart(e)
{
    // Target (this) element is the source node.
    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);

    this.classList.add('dragElem');
    swap1=this.getAttribute('order');

}
function handleDragOver(e)
{
    if (e.preventDefault)
    {
        e.preventDefault(); // Necessary. Allows us to drop.
    }
    this.classList.add('over');

    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

    return false;
}

function handleDragEnter(e)
{
    // this / e.target is the current hover target.
}
function handleDragLeave(e)
{
    this.classList.remove('over');  // this / e.target is previous target element.
}

function handleDrop(e)
{
    // this/e.target is current target element.

    if (e.stopPropagation)
    {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }

    // Don't do anything if dropping the same column we're dragging.
    if (dragSrcEl != this)
    {
        // Set the source column's HTML to the HTML of the column we dropped on.
        //alert(this.outerHTML);
        //dragSrcEl.innerHTML = this.innerHTML;
        //this.innerHTML = e.dataTransfer.getData('text/html');
        this.parentNode.removeChild(dragSrcEl);
        var dropHTML = e.dataTransfer.getData('text/html');
        this.insertAdjacentHTML('beforebegin',dropHTML);
        var dropElem = this.previousSibling;
        addDnDHandlers(dropElem);

        swap2=this.getAttribute('order');
        swapArrays(swap1,swap2);
        swap1=-1;
        swap2=-1;


    }
    this.classList.remove('over');
    return false;
}

function handleDragEnd(e)
{
    // this/e.target is the source node.
    this.classList.remove('over');

    /*[].forEach.call(cols, function (col) {
     col.classList.remove('over');
     });*/
}
function addDnDHandlers(elem)
{
    elem.addEventListener('dragstart', handleDragStart, false);
    elem.addEventListener('dragenter', handleDragEnter, false);
    elem.addEventListener('dragover', handleDragOver, false);
    elem.addEventListener('dragleave', handleDragLeave, false);
    elem.addEventListener('drop', handleDrop, false);
    elem.addEventListener('dragend', handleDragEnd, false);

}
function swapArrays(swap1,swap2)
{
    var app;

    app=itinerario[swap1];
    itinerario[swap1]=itinerario[swap2];
    itinerario[swap2]=app;

    loadItinerario();

    swap1++;
    swap2++;
    app=_mapPoints[swap1];
    _mapPoints[swap1]=_mapPoints[swap2];
    _mapPoints[swap2]=app;

    getRoutePointsAndWaypoints();

    totTime=0;
    computeDuration();

}

function removeFromArray(array,index) {
    var result =[];
    for(var i=0; i<array.length; i++){
        if(i != index)
            result.push(array[i]);
    }
    return result;
}

function computeDuration(){

    var CORS = "https://cors-anywhere.herokuapp.com/";

    totTime=parseInt(timeVisit*60);

    for(var i = 0; i < _mapPoints.length-1; i++)
    {
        var destination1 = _mapPoints[i].lat+","+_mapPoints[i].lng;
        var destination2 = _mapPoints[i+1].lat+","+_mapPoints[i+1].lng;

        var url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+destination1+"&destinations="+destination2+"&mode=walking&key=AIzaSyAa6bQpbcPxZyWLjtqqOlBEO-tvfP_kYKM";

        url = CORS+url;

        $.ajax({
            url: url,
            crossDomain : true,
            success: function(result){
                var time = result.rows[0].elements[0].duration.value;
                totTime = totTime + time;
                var timeLabel = document.getElementById('time');
                timeLabel.textContent = marco(parseInt(totTime/60));
            }
        });
    }


}

function marco(minutes){
    if( minutes < 60 ){
        return minutes+"min"
    }else{
        return (minutes-minutes%60)/60+"h "+minutes%60+"min"
    }
}

function QRMessage(){

    var QRdiv = document.getElementById("descriptorQR");
    QRdiv.setAttribute('style', 'display:block;');


    var newArray = JSON.parse(JSON.stringify(_mapPoints));

    newArray = deleteElement(newArray, '0');

    var obj = {
        "way": newArray,
        "itr": itinerario,
        "t": timeVisit
    };

    var text = JSON.stringify(obj);

    var QRurl = endPoint + "way=" + text;

    var imagequery = "http://api.qrserver.com/v1/create-qr-code/?data=" + QRurl + "&size=150x150"

    $('#QRimage').attr("src", imagequery);

}


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function reinsertItinerary(){
    var tmpArray = JSON.parse(getParameterByName("way"));
    console.log(tmpArray)

    itinerario = tmpArray.itr;
    console.log(itinerario)
    loadItinerario();

    timeVisit = tmpArray.t;
    var tVisit = document.getElementById('right');
    tVisit.textContent = marco(timeVisit);

    var wayTmp = tmpArray.way;

    for(var uuid in wayTmp){
        if(wayTmp.hasOwnProperty(uuid) && uuid !== 'length'){
            _mapPoints[parseInt(uuid)] = wayTmp[uuid];
        }
    }
    _mapPoints['length'] = wayTmp['length'];

    l = wayTmp['length'];

    getRoutePointsAndWaypoints();

    totTime=0;
    computeDuration();
}
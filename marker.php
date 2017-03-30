<?php

@require_once("config.php"); //includo la configurazione del file .php di connessione al db

$lingua = $_GET['lingua'];

if(isset($lingua) and $lingua == "it") {  /*se abbiamo passato la lingua e la lingua passata è ita allora... altrimenti se non è stato passata oppure è italiana ... */
    $query = "SELECT name_it, lat, lng, desc_it, path FROM poi";

} else{
    $query = "SELECT name_en, lat, lng, desc_en, path FROM poi";

}
$pointsOfInterest = mysqli_query($conn, $query); // Eseguo la query , $pointsOfInterest è il nome che ho dato alla query

$markers = array();
$count = 0;
while( $row = mysqli_fetch_row($pointsOfInterest)){
    $marker = array();
    $marker['name'] = $row[0];
    $marker['coordinate'] = array( "lat" => $row[1],
        "lng" => $row[2]);
    $marker['description']= $row[3];
    $marker['path']= $row[4];
    $markers[$count] = $marker;
    $count = $count+1;

}
echo json_encode($markers); //processo di "codifica"
/*

markers:
    0: nome = "sdfsdsd"
       coordinate:
            lat = asfsfasfas
            lng = safsdfsagf
    1: nome = "sdfsdsd"
       coordinate:
            lat = asfsfasfas
            lng = safsdfsagf
    2: nome = "sdfsdsd"
       coordinate:
            lat = asfsfasfas
            lng = safsdfsagf
 */
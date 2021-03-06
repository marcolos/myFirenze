<?php

@require_once("config.php");

$lingua = $_GET['lingua'];

if(isset($lingua) and $lingua == "it") {
    $query = "SELECT name_it, lat, lng, desc_it, path, duration FROM poi WHERE ID_POI IN (4,13,28,3,30)";

} else{
    $query = "SELECT name_en, lat, lng,  desc_en, path, duration FROM poi WHERE ID_POI IN (4,13,28,3,30)";

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
    $marker['duration']= $row[5];
    $markers[$count] = $marker;
    $count = $count+1;

}
echo json_encode($markers);

?>
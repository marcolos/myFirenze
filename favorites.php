<?php

@require_once("config.php");

$lingua = $_GET['lingua'];

if(isset($lingua) and $lingua == "it") {
    $query = "SELECT name_it, desc_it, path FROM poi WHERE ID_POI IN (4,13,23,25,28,3,10,12)";

} else{
    $query = "SELECT name_en, desc_en, path FROM poi WHERE ID_POI IN (4,13,23,25,28,3,10,12)";

}
$pointsOfInterest = mysqli_query($conn, $query); // Eseguo la query , $pointsOfInterest è il nome che ho dato alla query
$markers = array();
$count = 0;
while( $row = mysqli_fetch_row($pointsOfInterest)){
    $marker = array();
    $marker['name'] = $row[0];
    $marker['description']= $row[1];
    $marker['path']= $row[2];
    $markers[$count] = $marker;
    $count = $count+1;

}
echo json_encode($markers);














?>
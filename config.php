<?php

    // Informazioni riguardo al database
    $db_name = "myfirenze";
    $db_user = "root";
    $db_pw = "root";
    $db_host = "localhost";

    //Connecting to my database , devo passare questi 4 parametri)
    $conn = mysqli_connect($db_host , $db_user , $db_pw, $db_name) ;

    if (!$conn){
        die("Not connected");
    }
?>
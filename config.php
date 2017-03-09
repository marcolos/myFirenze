<?php
    $db_name = "myfirenze";
    $db_user = "root";
    $db_pw = "root";
    $db_host = "localhost";

    $conn = mysqli_connect($db_host , $db_user , $db_pw, $db_name) ;

    if (!$conn){
        die("Not connected");
    }

?>
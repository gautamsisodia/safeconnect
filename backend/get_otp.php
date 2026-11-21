<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
if(file_exists("mail.log")){
    $lines = file("mail.log");
    $last = end($lines);
    echo json_encode(["success"=>true,"last_log"=>$last,"all"=>array_slice($lines,-10)]);
} else {
    echo json_encode(["success"=>false,"message"=>"mail.log not found"]);
}
?>
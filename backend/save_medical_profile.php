<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

if (file_exists('dbconnect.php')) include 'dbconnect.php'; else include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'] ?? '';
$blood_group = $data['blood_group'] ?? null;
$medical_notes = $data['medical_notes'] ?? null;

if(!$user_id){
  echo json_encode(["success"=>false, "error"=>"user_id missing"]);
  exit;
}

$stmt = $conn->prepare("INSERT INTO user_medical_profiles (user_id, blood_group, medical_notes) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE blood_group=VALUES(blood_group), medical_notes=VALUES(medical_notes)");
$stmt->bind_param("sss", $user_id, $blood_group, $medical_notes);

if($stmt->execute()){
  echo json_encode(["success"=>true, "message"=>"Saved"]);
} else {
  echo json_encode(["success"=>false, "error"=>$stmt->error]);
}
?>
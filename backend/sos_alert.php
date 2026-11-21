<?php
include 'dbconnect.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'] ?? '';
$user_name = $data['user_name'] ?? '';
$latitude = $data['latitude'] ?? null;
$longitude = $data['longitude'] ?? null;

$type = "Emergency SOS";
$desc = "SOS button pressed";

$stmt = $conn->prepare("INSERT INTO emergency_details (user_id, user_name, emergency_type, description, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssdd", $user_id, $user_name, $type, $desc, $latitude, $longitude);
$stmt->execute();

echo json_encode(["status" => "success", "message" => "SOS saved"]);
$stmt->close();
$conn->close();
?>
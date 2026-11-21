<?php
include 'dbconnect.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'] ?? '';
$user_name = $data['user_name'] ?? '';
$emergency_type = $data['emergency_type'] ?? '';
$description = $data['description'] ?? '';
$latitude = $data['latitude'] ?? null;
$longitude = $data['longitude'] ?? null;

$stmt = $conn->prepare("INSERT INTO emergency_details (user_id, user_name, emergency_type, description, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssdd", $user_id, $user_name, $emergency_type, $description, $latitude, $longitude);

if($stmt->execute()){
    echo json_encode(["status" => "success", "message" => "Alert saved"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
$stmt->close();
$conn->close();
?>
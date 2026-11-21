<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit; }

// Tere folder me dbconnect.php hai, db_connect.php nahi - dono try karenge
if (file_exists('dbconnect.php')) {
    include 'dbconnect.php';
} else if (file_exists('db_connect.php')) {
    include 'db_connect.php';
} else {
    echo json_encode(["success" => false, "error" => "dbconnect.php file not found"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'] ?? 'unknown@gmail.com';
$user_name = $data['user_name'] ?? 'User';
$emergency_type = strtolower(trim($data['emergency_type'] ?? 'other'));
$description = $data['description'] ?? $data['address'] ?? '';
$latitude = floatval($data['latitude'] ?? 0);
$longitude = floatval($data['longitude'] ?? 0);

// 1. emergency_details me save
$stmt = $conn->prepare("INSERT INTO emergency_details (user_id, user_name, emergency_type, description, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)");
if(!$stmt){
  echo json_encode(["success"=>false, "error"=>"Prepare failed for details: ".$conn->error]);
  exit;
}
$stmt->bind_param("ssssdd", $user_id, $user_name, $emergency_type, $description, $latitude, $longitude);
if (!$stmt->execute()) {
    echo json_encode(["success" => false, "error" => "Details Insert: " . $stmt->error]);
    exit;
}
$emergency_id = $stmt->insert_id;

// 2. Helpline fetch
$hq = $conn->prepare("SELECT authority_name, helpline_number FROM helplines WHERE emergency_type = ? LIMIT 1");
$hq->bind_param("s", $emergency_type);
$hq->execute();
$res = $hq->get_result();
$hl = $res->fetch_assoc();

if (!$hl) {
    $hq2 = $conn->query("SELECT authority_name, helpline_number FROM helplines WHERE emergency_type='other' LIMIT 1");
    $hl = $hq2 ? $hq2->fetch_assoc() : ["authority_name"=>"National Emergency Helpline","helpline_number"=>"112"];
}

// 3. dispatch log me save
$log = $conn->prepare("INSERT INTO emergency_dispatch_log (emergency_id, user_id, emergency_type, authority_name, helpline_number, user_location) VALUES (?, ?, ?, ?, ?, ?)");
if(!$log){
  echo json_encode(["success"=>false, "error"=>"Prepare failed for dispatch: ".$conn->error]);
  exit;
}
$log->bind_param("isssss", $emergency_id, $user_id, $emergency_type, $hl['authority_name'], $hl['helpline_number'], $description);
if (!$log->execute()) {
    echo json_encode(["success" => false, "error" => "Dispatch Insert: " . $log->error]);
    exit;
}

echo json_encode([
    "success" => true,
    "emergency_id" => $emergency_id,
    "message" => "Hi $user_name, your ".strtoupper($emergency_type)." alert forwarded to ".$hl['authority_name']." (".$hl['helpline_number'].") Ticket #EMG-$emergency_id",
    "dispatch" => $hl
]);
?>
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }

include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$otp = trim($data['otp'] ?? '');
$now = date("Y-m-d H:i:s");

if(!$email || !$otp){ echo json_encode(["success"=>false,"message"=>"Email / OTP missing"]); exit; }

$stmt = $conn->prepare("SELECT * FROM pending_otps WHERE email=? AND otp=?");
$stmt->bind_param("ss",$email,$otp);
$stmt->execute();
$result = $stmt->get_result();

if($row = $result->fetch_assoc()){
    $ins = $conn->prepare("INSERT INTO users (name,email,password,phone,is_verified) VALUES (?,?,?,?,1) ON DUPLICATE KEY UPDATE is_verified=1, phone=VALUES(phone), password=VALUES(password)");
    $ins->bind_param("ssss",$row['name'],$row['email'],$row['password'],$row['phone']);
    $ins->execute();
    $userId = $conn->insert_id ?: 1;
    $del = $conn->prepare("DELETE FROM pending_otps WHERE email=?");
    $del->bind_param("s",$email); $del->execute();

    echo json_encode(["success"=>true, "user"=>[
        "user_id"=>$userId, "id"=>$userId,
        "email"=>$row['email'], "name"=>$row['name'],
        "phone"=>$row['phone'],
        "registered_at"=>$now
    ]]);
} else {
    echo json_encode(["success"=>false,"message"=>"Invalid OTP"]);
}
?>
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
include 'dbconnect.php';
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? $_POST['email'] ?? '';
$password = $data['password'] ?? $_POST['password'] ?? '';

$stmt = $conn->prepare("SELECT * FROM users WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
if($result->num_rows == 0){ echo json_encode(['status'=>'error','message'=>'User not found']); exit; }
$row = $result->fetch_assoc();

if($row['is_verified'] == 0){ echo json_encode(['status'=>'error','message'=>'Please verify OTP first']); exit; }

if(password_verify($password, $row['password'])){
    echo json_encode(['status'=>'success','message'=>'Login success','user'=>['user_id'=>(int)$row['id'],'name'=>$row['name'],'email'=>$row['email'],'phone'=>$row['phone']]]);
} else {
    http_response_code(401); echo json_encode(['status'=>'error','message'=>'Invalid Password']);
}
?>
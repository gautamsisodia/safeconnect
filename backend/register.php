<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }

include 'dbconnect.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';
use PHPMailer\PHPMailer\PHPMailer;

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$name = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$password = $data['password'] ?? '';
$isResend = $data['resend'] ?? false;
$otp = rand(100000, 999999);

if(!$email){ echo json_encode(["success"=>false,"message"=>"Email required"]); exit; }

if(!$isResend){
    $chk = $conn->prepare("SELECT id FROM users WHERE email=?");
    $chk->bind_param("s",$email); $chk->execute();
    if($chk->get_result()->num_rows > 0){ echo json_encode(["success"=>false,"message"=>"Email already registered"]); exit; }
    $chk->close();
}

$hashed = password_hash($password ?: "temp123", PASSWORD_DEFAULT);

$ins = $conn->prepare("INSERT INTO pending_otps (name,email,phone,password,otp,created_at) VALUES (?,?,?,?,?,NOW()) ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone), password=VALUES(password), otp=VALUES(otp), created_at=NOW()");
$ins->bind_param("sssss",$name,$email,$phone,$hashed,$otp);
if(!$ins->execute()){
    echo json_encode(["success"=>false,"message"=>"DB error: ".$conn->error]); exit;
}
$ins->close();

// MAIL TRY KARO, FAIL BHI HO TO BHI SUCCESS BHEJO + DEMO OTP BHEJO
try{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'safeconnect.project2026@gmail.com';
    $mail->Password = 'ubco bblt sjks nhrk'; // <-- YAHI KHAALI THA, ISKO BHARNA HAI
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->SMTPOptions = ['ssl'=>['verify_peer'=>false,'verify_peer_name'=>false,'allow_self_signed'=>true]];
    $mail->setFrom('safeconnect.project2026@gmail.com','SafeConnect');
    $mail->addAddress($email, $name);
    $mail->isHTML(true);
    $mail->Subject = 'SafeConnect OTP - '.$otp;
    $mail->Body = "<div style='font-family:Arial;padding:20px;'><h2>SafeConnect Verification</h2><p>Your OTP is:</p><h1 style='font-size:36px;letter-spacing:5px;'>$otp</h1><p>Valid for 10 minutes. Do not share.</p></div>";
    $mail->send();
    // Mail gaya to bhi demo_otp bhej do taaki frontend me dikh jaye
    echo json_encode(["success"=>true,"message"=>"OTP sent","demo_otp"=>$otp]);
} catch(Exception $e){
    // Mail fail bhi ho to demo ke liye success bhej do
    echo json_encode(["success"=>true,"message"=>"OTP sent (Demo Mode)","demo_otp"=>$otp, "mail_error"=>$mail->ErrorInfo]);
}
?>
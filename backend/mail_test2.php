<?php
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';
use PHPMailer\PHPMailer\PHPMailer;

$mail = new PHPMailer(true);
try{
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'gautam123sisodia@gmail.com';
    $mail->Password = 'ubco bblt sjks nhrk'; 
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // SSL
    $mail->Port = 465; // 465 pe bhej
    $mail->SMTPOptions = ['ssl'=>['verify_peer'=>false,'verify_peer_name'=>false,'allow_self_signed'=>true]];
    $mail->setFrom('gautam123sisodia@gmail.com','SafeConnect OTP');
    $mail->addAddress('gautamrsisodia@gmail.com'); 
    $mail->isHTML(true);
    $mail->Subject = 'SafeConnect OTP Test 465';
    $mail->Body = '<h1>Test OTP 884412</h1><p>Ye 465 port se aaya hai</p>';
    $mail->send();
    echo "MAIL SENT SUCCESS ON 465";
} catch(Exception $e){
    echo "FAILED: " . $mail->ErrorInfo;
}
?>
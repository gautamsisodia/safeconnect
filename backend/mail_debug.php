<?php
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';
use PHPMailer\PHPMailer\PHPMailer;

$mail = new PHPMailer(true);
try{
    $mail->SMTPDebug = 2; // Ye error dikhayega
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'safeconnect.project2026@gmail.com';
    $mail->Password = 'ubco bblt sjks nhrk';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->SMTPOptions = ['ssl'=>['verify_peer'=>false,'verify_peer_name'=>false,'allow_self_signed'=>true]];
    $mail->setFrom('gautam123sisodia@gmail.com','SafeConnect');
    $mail->addAddress('gautamrsisodia@gmail.com');
    $mail->isHTML(true);
    $mail->Subject = 'Test OTP';
    $mail->Body = 'Test OTP 123456';
    $mail->send();
    echo "<br><b>MAIL SENT SUCCESS</b>";
} catch(Exception $e){
    echo "<br><b>FAILED: " . $mail->ErrorInfo . "</b>";
}
?>
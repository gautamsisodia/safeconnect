<?php
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';
use PHPMailer\PHPMailer\PHPMailer;

$mail = new PHPMailer(true);
try{
    $mail->SMTPDebug = 2; // ye pura error dikhayega
    $mail->Debugoutput = 'html';
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'safeconnect.project2026@gmail.com';
    $mail->Password = 'fcxejccddiijfxgd'; // naya wala
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;
    $mail->SMTPOptions = ['ssl'=>['verify_peer'=>false,'verify_peer_name'=>false,'allow_self_signed'=>true]];
    $mail->setFrom('safeconnect.project2026@gmail.com','SafeConnect');
    $mail->addAddress('gautamrsisodia@gmail.com');
    $mail->Subject = 'Final Test OTP';
    $mail->Body = 'OTP 123456 - agar ye aaya to naya password kaam kar raha hai';
    $mail->send();
    echo "<br><h2 style='color:green'>MAIL SENT SUCCESS - Ab Gmail ka Sent folder check kar</h2>";
} catch(Exception $e){
    echo "<br><h2 style='color:red'>FAILED: " . $mail->ErrorInfo . "</h2>";
}
?>
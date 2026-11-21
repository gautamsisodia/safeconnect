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
    $mail->Username = 'safeconnect.project2026@gmail.com';
    $mail->Password = 'tcqnxqkkiyrpivrz'; // bina space ke
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;
    $mail->SMTPOptions = ['ssl'=>['verify_peer'=>false,'verify_peer_name'=>false,'allow_self_signed'=>true]];
    $mail->SMTPDebug = 2; // ye error dikhayega
    $mail->Debugoutput = 'html';
    $mail->setFrom('safeconnect.project2026@gmail.com','SafeConnect');
    $mail->addAddress('gautamrsisodia@gmail.com'); // yahan apna mail daal test ke liye
    $mail->Subject = 'Test OTP Mail';
    $mail->Body = 'Ye test mail hai, agar ye aa gaya to OTP bhi ayega - 123456';
    $mail->send();
    echo "MAIL SENT SUCCESS";
} catch(Exception $e){
    echo "MAIL FAILED: " . $mail->ErrorInfo;
}
?>
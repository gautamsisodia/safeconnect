<?php
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';
use PHPMailer\PHPMailer\PHPMailer;
$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'gautam123sisodia@gmail.com';
    $mail->Password = 'ouvumcroytemhnud';
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;
    $mail->setFrom('gautam123sisodia@gmail.com','SafeConnect');
    $mail->addAddress('safeconnect.project2026@gmail.com');
    $mail->Subject = 'Final Test 123';
    $mail->Body = 'OTP 123456';
    $mail->SMTPDebug = 2;
    $mail->send();
    echo "SUCCESS - Mail gaya";
} catch(Exception $e){ echo "FAIL: ".$mail->ErrorInfo; }
?>
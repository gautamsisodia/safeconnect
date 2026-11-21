<?php
// Smart Config - Localhost + Live dono chalega

if ($_SERVER['HTTP_HOST'] == 'localhost' || $_SERVER['HTTP_HOST'] == '127.0.0.1') {
    // Jab VS Code / XAMPP me chalega - Local wala
    $host = "localhost";
    $user = "root";
    $pass = "";
    $db   = "safeconnect";
} else {
    // Jab App / InfinityFree pe chalega - Live wala
    $host = "sql107.infinityfree.com";
    $user = "if0_43372635";
    $pass = "jZZH3Zfnyu95pL";
    $db   = "if0_43372635_safeconnect_db";
}

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>
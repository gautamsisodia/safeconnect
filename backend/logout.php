<?php

session_start();

session_destroy();

$isApi = (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) ||
         (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false);

if ($isApi) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => 'Logged out successfully.']);
    exit();
}

header("Location: login.html");

exit();

?>

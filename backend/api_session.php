<?php

session_start();

include 'dbconnect.php';

header('Content-Type: application/json');

if (!isset($_SESSION['email'])) {
    // Check if there is any user in database for initial state
    $res = $conn->query("SELECT user_id, name, phone, email, registered_at FROM users ORDER BY user_id DESC LIMIT 1");
    if ($res && $res->num_rows > 0) {
        $u = $res->fetch_assoc();
        echo json_encode([
            'authenticated' => false,
            'recent_user' => [
                'user_id' => (int)$u['user_id'],
                'name' => $u['name'],
                'phone' => $u['phone'],
                'email' => $u['email'],
                'registered_at' => $u['registered_at']
            ]
        ]);
        exit();
    }

    echo json_encode(['authenticated' => false, 'user' => null]);
    exit();
}

$email = $conn->real_escape_string($_SESSION['email']);
$res = $conn->query("SELECT user_id, name, phone, email, registered_at FROM users WHERE email='$email'");

if ($res && $res->num_rows > 0) {
    $u = $res->fetch_assoc();
    echo json_encode([
        'authenticated' => true,
        'user' => [
            'user_id' => (int)$u['user_id'],
            'name' => $u['name'],
            'phone' => $u['phone'],
            'email' => $u['email'],
            'registered_at' => $u['registered_at']
        ]
    ]);
} else {
    echo json_encode([
        'authenticated' => true,
        'user' => [
            'user_id' => 1,
            'name' => $_SESSION['name'] ?? 'SafeConnect User',
            'phone' => $_SESSION['phone'] ?? '',
            'email' => $_SESSION['email'],
            'registered_at' => date('Y-m-d H:i:s')
        ]
    ]);
}

$conn->close();
?>

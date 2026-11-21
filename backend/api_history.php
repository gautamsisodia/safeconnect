<?php

session_start();

include 'dbconnect.php';

header('Content-Type: application/json');

$email = $_GET['email'] ?? ($_SESSION['email'] ?? '');
$userId = $_GET['user_id'] ?? null;

if (empty($userId) && !empty($email)) {
    $emailClean = $conn->real_escape_string($email);
    $uRes = $conn->query("SELECT user_id FROM users WHERE email='$emailClean'");
    if ($uRes && $uRes->num_rows > 0) {
        $uRow = $uRes->fetch_assoc();
        $userId = $uRow['user_id'];
    }
}

if (!empty($userId)) {
    $userIdClean = (int)$userId;
    $sql = "SELECT * FROM emergency_details WHERE user_id='$userIdClean' ORDER BY emergency_id DESC";
} else {
    $sql = "SELECT * FROM emergency_details ORDER BY emergency_id DESC";
}

$result = $conn->query($sql);
$history = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $createdAt = $row['created_at'];
        $ts = strtotime($createdAt);
        $history[] = [
            'emergency_id' => (int)$row['emergency_id'],
            'user_id' => (int)$row['user_id'],
            'user_name' => $row['user_name'],
            'emergency_type' => $row['emergency_type'],
            'date' => date('Y-m-d', $ts),
            'time' => date('h:i A', $ts),
            'created_at' => $createdAt,
            'status' => 'Active'
        ];
    }
}

echo json_encode([
    'status' => 'success',
    'history' => $history
]);

$conn->close();
?>

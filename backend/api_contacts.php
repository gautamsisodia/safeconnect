<?php

session_start();

include 'dbconnect.php';

header('Content-Type: application/json');

$email = $_GET['email'] ?? ($_SESSION['email'] ?? '');

if (empty($email)) {
    // If not in session or query, get all contacts from database
    $sql = "SELECT * FROM trusted_contacts ORDER BY contact_id DESC";
} else {
    $emailClean = $conn->real_escape_string($email);
    $sql = "SELECT * FROM trusted_contacts WHERE user_email='$emailClean' ORDER BY contact_id DESC";
}

$result = $conn->query($sql);
$contacts = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $contacts[] = [
            'contact_id' => (int)$row['contact_id'],
            'user_email' => $row['user_email'],
            'contact_name' => $row['contact_name'],
            'contact_phone' => $row['contact_phone'],
            'relationship' => $row['relationship'],
            'created_at' => $row['created_at']
        ];
    }
}

echo json_encode([
    'status' => 'success',
    'contacts' => $contacts
]);

$conn->close();
?>

<?php

session_start();

include 'dbconnect.php';

$contact_name = $_POST['contact_name'] ?? '';
$contact_phone = $_POST['contact_phone'] ?? '';
$relationship = $_POST['relationship'] ?? '';

if (empty($contact_name)) {
    $rawInput = json_decode(file_get_contents('php://input'), true);
    if ($rawInput) {
        $contact_name = $rawInput['contact_name'] ?? ($rawInput['contactName'] ?? '');
        $contact_phone = $rawInput['contact_phone'] ?? ($rawInput['contactPhone'] ?? '');
        $relationship = $rawInput['relationship'] ?? '';
    }
}

$user_email = $_SESSION['email'] ?? '';
if (empty($user_email) && isset($rawInput['user_email'])) {
    $user_email = $rawInput['user_email'];
}

$isApi = (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) ||
         (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false);

if (empty($user_email)) {
    if ($isApi) {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Please login first.']);
        exit();
    }
    header("Location: login.html");
    exit();
}

$cNameClean = $conn->real_escape_string($contact_name);
$cPhoneClean = $conn->real_escape_string($contact_phone);
$cRelClean = $conn->real_escape_string($relationship);
$uEmailClean = $conn->real_escape_string($user_email);

$sql = "INSERT INTO trusted_contacts
(user_email, contact_name, contact_phone, relationship)
VALUES
('$uEmailClean','$cNameClean','$cPhoneClean','$cRelClean')";

if ($conn->query($sql) === TRUE)
{
    $contactId = $conn->insert_id;

    if ($isApi) {
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'success',
            'message' => 'Trusted contact added successfully.',
            'contact' => [
                'contact_id' => (int)$contactId,
                'user_email' => $user_email,
                'contact_name' => $contact_name,
                'contact_phone' => $contact_phone,
                'relationship' => $relationship,
                'created_at' => date('Y-m-d H:i:s')
            ]
        ]);
        exit();
    }

    header("Location: dashboard.php");
    exit();
}
else
{
    if ($isApi) {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => "Error: " . $conn->error]);
        exit();
    }
    echo "Error: " . $conn->error;
}

$conn->close();

?>

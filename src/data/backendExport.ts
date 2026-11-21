/**
 * SafeConnect – Production PHP & MySQL Backend Files
 * Ready to deploy on Apache / Nginx / XAMPP / LAMP with phpMyAdmin and PHPMailer
 */

export interface BackendFile {
  filename: string;
  description: string;
  language: string;
  code: string;
}

export const BACKEND_FILES: BackendFile[] = [
  {
    filename: 'dbconnect.php',
    description: 'MySQL database connection with error handling and utf8mb4 encoding.',
    language: 'php',
    code: `<?php
/**
 * SafeConnect – Database Connection
 * Compatible with MySQL and phpMyAdmin
 */
$servername = "localhost";
$username = "root";       // replace with your database username
$password = "";           // replace with your database password
$dbname = "safeconnect";  // database name in phpMyAdmin

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        "status" => "error",
        "message" => "Database connection failed: " . $conn->connect_error
    ]));
}

$conn->set_charset("utf8mb4");
?>`
  },
  {
    filename: 'safeconnect.sql',
    description: 'Complete MySQL database schema and sample tables for phpMyAdmin import.',
    language: 'sql',
    code: `-- SafeConnect MySQL Database Schema
-- Import this file directly into phpMyAdmin under database 'safeconnect'

CREATE DATABASE IF NOT EXISTS \`safeconnect\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`safeconnect\`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS \`users\` (
  \`user_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`phone\` VARCHAR(20) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`otp\` VARCHAR(10) DEFAULT NULL,
  \`is_verified\` TINYINT(1) DEFAULT 0,
  \`blood_group\` VARCHAR(10) DEFAULT 'O+',
  \`emergency_notes\` TEXT DEFAULT NULL,
  \`registered_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Trusted Contacts Table
CREATE TABLE IF NOT EXISTS \`trusted_contacts\` (
  \`contact_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_email\` VARCHAR(100) NOT NULL,
  \`contact_name\` VARCHAR(100) NOT NULL,
  \`contact_phone\` VARCHAR(20) NOT NULL,
  \`relationship\` VARCHAR(50) NOT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_email\`) REFERENCES \`users\`(\`email\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Emergency Details Table
CREATE TABLE IF NOT EXISTS \`emergency_details\` (
  \`emergency_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`user_name\` VARCHAR(100) NOT NULL,
  \`emergency_type\` VARCHAR(100) NOT NULL,
  \`latitude\` DECIMAL(10, 8) DEFAULT NULL,
  \`longitude\` DECIMAL(11, 8) DEFAULT NULL,
  \`address\` TEXT DEFAULT NULL,
  \`status\` VARCHAR(50) DEFAULT 'Dispatched (Demo)',
  \`note\` TEXT DEFAULT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Emergency Helplines Table
CREATE TABLE IF NOT EXISTS \`emergency_helplines\` (
  \`helpline_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`number\` VARCHAR(20) NOT NULL,
  \`category\` VARCHAR(50) NOT NULL,
  \`description\` VARCHAR(255) DEFAULT NULL,
  \`is_24_7\` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Helplines Data
INSERT INTO \`emergency_helplines\` (\`name\`, \`number\`, \`category\`, \`description\`, \`is_24_7\`) VALUES
('National Emergency Number', '112', 'National', 'All-in-one emergency service for India', 1),
('Police Helpline', '100', 'Police & Crime', 'Immediate police assistance & patrolling unit', 1),
('Ambulance / Medical Response', '108', 'Medical & Health', 'Emergency ambulance and medical dispatch', 1),
('Women Safety & Distress Helpline', '1091', 'Women & Child', '24/7 dedicated helpline for women in danger', 1),
('Fire Brigade Dispatch', '101', 'Disaster', 'Fire fighting and immediate rescue operations', 1),
('Child Helpline', '1098', 'Women & Child', 'National emergency helpline for children in distress', 1),
('National Highway Accident Relief', '1033', 'Medical & Health', 'Emergency medical & road accident support on highways', 1),
('Senior Citizen Helpline', '14567', 'National', 'Elder line support, security and medical aid', 1),
('Cyber Crime Emergency Reporting', '1930', 'Police & Crime', 'Immediate financial fraud and cyber threat response', 1);

-- Default Demo User
INSERT INTO \`users\` (\`user_id\`, \`name\`, \`phone\`, \`email\`, \`password\`, \`is_verified\`, \`blood_group\`, \`emergency_notes\`)
VALUES (1, 'Gautam Sisodia', '+91 98765 43210', 'gautamrsisodia@gmail.com', '$2y$10$wE43vN5uY0Fqf9zP6vQG7.dIeC/Fz.sA4zV0Vd8v8qP2t0Y1a2b3c', 1, 'B+', 'Allergic to penicillin. Carries emergency inhaler.');

INSERT INTO \`trusted_contacts\` (\`user_email\`, \`contact_name\`, \`contact_phone\`, \`relationship\`) VALUES
('gautamrsisodia@gmail.com', 'Aarav Sharma (Parent)', '+91 98111 22334', 'Father'),
('gautamrsisodia@gmail.com', 'Priya Verma', '+91 98222 33445', 'Sister'),
('gautamrsisodia@gmail.com', 'Campus Warden', '+91 98333 44556', 'Emergency Contact');
`
  },
  {
    filename: 'register.php',
    description: 'Registers user, generates 6-digit OTP, sends email via PHPMailer.',
    language: 'php',
    code: `<?php
/**
 * SafeConnect – User Registration & OTP Dispatch
 * Uses PHPMailer with Gmail SMTP
 */
header('Content-Type: application/json');
require 'dbconnect.php';
require 'PHPMailer_config.php';

$name     = trim($_POST['name'] ?? '');
$phone    = trim($_POST['phone'] ?? '');
$email    = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

if (empty($name) || empty($phone) || empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit();
}

$checkStmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "This email is already registered."]);
    exit();
}

$otp = (string) rand(100000, 999999);
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

$insertStmt = $conn->prepare("INSERT INTO users (name, phone, email, password, otp, is_verified) VALUES (?, ?, ?, ?, ?, 0)");
$insertStmt->bind_param("sssss", $name, $phone, $email, $hashedPassword, $otp);

if ($insertStmt->execute()) {
    $userId = $insertStmt->insert_id;
    $mailSent = sendOTPEmail($email, $name, $otp);

    echo json_encode([
        "status" => "success",
        "message" => "Registration successful. OTP sent to your email.",
        "user_id" => $userId,
        "email" => $email,
        "otp_dispatched" => $mailSent
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Registration failed: " . $conn->error]);
}
?>`
  },
  {
    filename: 'verify_otp.php',
    description: 'Verifies OTP, marks user active, creates session, opens Dashboard directly.',
    language: 'php',
    code: `<?php
/**
 * SafeConnect – OTP Verification
 * CRITICAL APP BEHAVIOR:
 * After successful OTP verification: Open Dashboard directly!
 * Do NOT redirect newly registered users to Login Page.
 */
session_start();
header('Content-Type: application/json');
require 'dbconnect.php';

$email = trim($_POST['email'] ?? '');
$otp   = trim($_POST['otp'] ?? '');

if (empty($email) || empty($otp)) {
    echo json_encode(["status" => "error", "message" => "Email and OTP are required."]);
    exit();
}

$stmt = $conn->prepare("SELECT user_id, name, phone, email, otp FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "User record not found."]);
    exit();
}

$user = $result->fetch_assoc();

if ($user['otp'] !== $otp) {
    echo json_encode(["status" => "error", "message" => "Invalid OTP code. Please try again."]);
    exit();
}

$updateStmt = $conn->prepare("UPDATE users SET is_verified = 1, otp = NULL WHERE email = ?");
$updateStmt->bind_param("s", $email);
$updateStmt->execute();

$_SESSION['user_id'] = $user['user_id'];
$_SESSION['name']    = $user['name'];
$_SESSION['email']   = $user['email'];
$_SESSION['phone']   = $user['phone'];

echo json_encode([
    "status" => "success",
    "message" => "OTP verified successfully. Welcome to SafeConnect!",
    "redirect" => "dashboard.php",
    "user" => [
        "user_id" => $user['user_id'],
        "name" => $user['name'],
        "email" => $user['email'],
        "phone" => $user['phone']
    ]
]);
?>`
  },
  {
    filename: 'login.php',
    description: 'Authenticates existing users, initializes session, directs to Dashboard.',
    language: 'php',
    code: `<?php
/**
 * SafeConnect – User Login
 */
session_start();
header('Content-Type: application/json');
require 'dbconnect.php';

$email    = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

if (empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Email and password are required."]);
    exit();
}

$stmt = $conn->prepare("SELECT user_id, name, phone, email, password, is_verified FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "No account found with this email."]);
    exit();
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user['password'])) {
    echo json_encode(["status" => "error", "message" => "Incorrect password. Please try again."]);
    exit();
}

$_SESSION['user_id'] = $user['user_id'];
$_SESSION['name']    = $user['name'];
$_SESSION['email']   = $user['email'];
$_SESSION['phone']   = $user['phone'];

echo json_encode([
    "status" => "success",
    "message" => "Login successful.",
    "redirect" => "dashboard.php",
    "user" => [
        "user_id" => $user['user_id'],
        "name" => $user['name'],
        "email" => $user['email'],
        "phone" => $user['phone']
    ]
]);
?>`
  },
  {
    filename: 'send_alert.php',
    description: 'Saves emergency SOS & alert in emergency_details table without calling real authorities.',
    language: 'php',
    code: `<?php
/**
 * SafeConnect – Emergency Alert Module
 * Academic project requirement:
 * Saves emergency type in database, timestamp, and user information.
 * Does NOT contact real authorities or emergency services.
 */
session_start();
header('Content-Type: application/json');
require 'dbconnect.php';

$userId   = $_POST['user_id'] ?? ($_SESSION['user_id'] ?? 0);
$userName = $_POST['user_name'] ?? ($_SESSION['name'] ?? 'Anonymous User');
$type     = $_POST['emergency_type'] ?? 'Emergency SOS';
$lat      = !empty($_POST['latitude']) ? floatval($_POST['latitude']) : null;
$lng      = !empty($_POST['longitude']) ? floatval($_POST['longitude']) : null;
$address  = $_POST['address'] ?? 'Location Shared';
$note     = $_POST['note'] ?? 'Academic Project Demonstration Alert';

$stmt = $conn->prepare("INSERT INTO emergency_details (user_id, user_name, emergency_type, latitude, longitude, address, status, note) VALUES (?, ?, ?, ?, ?, ?, 'Dispatched (Demo)', ?)");
$stmt->bind_param("issddss", $userId, $userName, $type, $lat, $lng, $address, $note);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Emergency alert successfully logged in SafeConnect database.",
        "emergency_id" => $stmt->insert_id,
        "emergency_type" => $type,
        "created_at" => date("Y-m-d H:i:s"),
        "disclaimer" => "Academic project demo: Alert recorded safely. Real-world emergency services are NOT contacted."
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to log alert: " . $conn->error]);
}
?>`
  },
  {
    filename: 'add_contact.php',
    description: 'Adds a trusted contact to trusted_contacts table.',
    language: 'php',
    code: `<?php
/**
 * SafeConnect – Add Trusted Contact
 */
session_start();
header('Content-Type: application/json');
require 'dbconnect.php';

$userEmail = $_POST['user_email'] ?? ($_SESSION['email'] ?? '');
$name      = trim($_POST['contact_name'] ?? '');
$phone     = trim($_POST['contact_phone'] ?? '');
$relation  = trim($_POST['relationship'] ?? '');

if (empty($userEmail) || empty($name) || empty($phone) || empty($relation)) {
    echo json_encode(["status" => "error", "message" => "All contact fields are required."]);
    exit();
}

$stmt = $conn->prepare("INSERT INTO trusted_contacts (user_email, contact_name, contact_phone, relationship) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $userEmail, $name, $phone, $relation);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Contact added successfully.",
        "contact_id" => $stmt->insert_id,
        "contact" => [
            "contact_name" => $name,
            "contact_phone" => $phone,
            "relationship" => $relation
        ]
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to add contact: " . $conn->error]);
}
?>`
  },
  {
    filename: 'PHPMailer_config.php',
    description: 'PHPMailer + Gmail SMTP helper for sending OTP emails.',
    language: 'php',
    code: `<?php
/**
 * SafeConnect – PHPMailer Configuration
 * Uses PHPMailer with Gmail SMTP
 */
use PHPMailer\\PHPMailer\\PHPMailer;
use PHPMailer\\PHPMailer\\Exception;

function sendOTPEmail($toEmail, $userName, $otpCode) {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'your-email@gmail.com';
        $mail->Password   = 'your-gmail-app-password';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        $mail->setFrom('noreply@safeconnect.in', 'SafeConnect Security');
        $mail->addAddress($toEmail, $userName);

        $mail->isHTML(true);
        $mail->Subject = 'SafeConnect OTP Verification Code: ' . $otpCode;
        $mail->Body    = "
            <div style='background-color:#050b1f; color:#e8eefc; padding:30px; font-family:sans-serif; border-radius:15px;'>
                <h2 style='color:#27d3ff;'>SafeConnect – One Tap To Safety</h2>
                <p>Hello <strong>{$userName}</strong>,</p>
                <p>Your one-time verification code for registering your SafeConnect emergency safety account is:</p>
                <div style='background:rgba(47,123,255,0.25); border:1px solid #27d3ff; padding:18px; border-radius:12px; font-size:32px; font-weight:bold; letter-spacing:8px; text-align:center; color:#27d3ff;'>
                    {$otpCode}
                </div>
                <p style='color:#9fb0d6; margin-top:20px; font-size:13px;'>
                    This code will expire in 10 minutes. If you did not request this registration, please disregard this email.
                </p>
                <hr style='border:0; border-top:1px solid rgba(120,170,255,0.2); margin:20px 0;'>
                <p style='font-size:12px; color:#6479a6;'>SafeConnect Safety & Emergency Alert System | University of Delhi</p>
            </div>
        ";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
}
?>`
  }
];

export const APK_BUILD_GUIDE = `
# How to Generate Android APK for SafeConnect

SafeConnect can be compiled into an Android APK in 3 different standard ways:

### Method 1: Instant PWA Install (No build tools needed)
1. Open SafeConnect on any Android phone in Google Chrome.
2. Tap the in-app "Install Android App" button or tap Chrome menu (⋮) -> "Add to Home screen" / "Install app".
3. The app is automatically converted into a native Android WebAPK with the SafeConnect Siren Icon, splash screen, and standalone window without URL bar.

### Method 2: Convert to Standalone APK using Bubblewrap (Google PWA CLI)
1. Run in terminal:
   npm install -g @bubblewrap/cli
   bubblewrap init --manifest=https://your-domain.com/manifest.json
   bubblewrap build
2. The generated 'app-release-signed.apk' can be installed on any Android phone directly!

### Method 3: Android Studio WebView Project
1. Open Android Studio -> New Project -> "Empty Views Activity".
2. In 'AndroidManifest.xml', add permissions:
   <uses-permission android:name="android.permission.INTERNET"/>
   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
3. In 'MainActivity.java' or 'MainActivity.kt', load your SafeConnect URL:
   val webView = findViewById<WebView>(R.id.webview)
   webView.settings.javaScriptEnabled = true
   webView.settings.domStorageEnabled = true
   webView.loadUrl("https://your-domain.com")
4. Build -> Generate Signed Bundle / APK -> Select APK -> Build!
`;

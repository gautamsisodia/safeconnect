<?php
include 'dbconnect.php';

// Check variable name $conn or $con
$db = null;
if (isset($conn)) $db = $conn;
if (isset($con)) $db = $con;

if (!$db) {
    die("<h2 style='color:red'>❌ dbconnect.php me \$conn / \$con naam ka variable nahi mila. File kharab hai.</h2>");
}

if ($db->connect_error) {
    die("<h2 style='color:red'>❌ Database Connect FAILED: " . $db->connect_error . "</h2>");
} else {
    echo "<h2 style='color:green'>✅ Database Connected Successfully!</h2>";
    echo "Host Info: " . $db->host_info . "<br>";
}

// Check table exist
$result = $db->query("SHOW TABLES LIKE 'emergency_details'");
if ($result->num_rows == 0) {
    echo "<h3 style='color:red'>❌ Table 'emergency_details' exist nahi karti! phpMyAdmin me bana.</h3>";
} else {
    echo "<h3 style='color:green'>✅ Table 'emergency_details' mili!</h3>";
    
    // Try insert test
    $test = $db->query("INSERT INTO emergency_details (user_id, user_name, emergency_type, description) VALUES ('test@test.com', 'Test', 'Test Alert', 'checking')");
    if($test){
        echo "<h3 style='color:green'>✅ INSERT Test Success! ID: " . $db->insert_id . "</h3>";
        $db->query("DELETE FROM emergency_details WHERE user_id='test@test.com'"); // clean test
    } else {
        echo "<h3 style='color:red'>❌ INSERT Failed: " . $db->error . "</h3>";
    }
}
?>
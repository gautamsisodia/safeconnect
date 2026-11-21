<?php

session_start();

if(!isset($_SESSION['email']))
{
    header("Location: login.html");
    exit();
}

include 'dbconnect.php';

?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SafeConnect Dashboard</title>
<link rel="stylesheet" href="style.css">

<style>

.dashboard{
    width:90%;
    max-width:1200px;
    margin:100px auto;
}

.top-card{
    padding:25px;
    margin-bottom:25px;
}

.grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
    gap:20px;
}

.card{
    padding:25px;
}

.sos-btn{
    width:100%;
    padding:20px;
    font-size:24px;
    font-weight:bold;
    border:none;
    border-radius:15px;
    cursor:pointer;
    background:#ff4d5e;
    color:white;
    box-shadow:0 0 25px rgba(255,77,94,.6);
}

.sos-btn:hover{
    transform:scale(1.03);
}

ul{
    padding-left:20px;
}

.logout-btn{
    display:inline-block;
    margin-top:20px;
}


</style>
</head>

<body>

<div class="dashboard">

    <!-- User Info -->

    <div class="glass top-card">
        <h1>Welcome to SafeConnect Dashboard 🎉</h1>

        <p><strong>Name:</strong> <?php echo $_SESSION['name']; ?></p>
        <p><strong>Email:</strong> <?php echo $_SESSION['email']; ?></p>
        <p><strong>Status:</strong> Active</p>
    </div>

    <div class="grid">

        <!-- SOS -->

        <div class="glass card">
            <h2>🚨 Emergency SOS</h2>

            <br>

            <button class="sos-btn">
                SEND SOS ALERT
            </button>

            <p style="color:#9fb0d6; line-height:1.8; margin-top:15px;">

            Use SOS when you are facing any emergency situation such as:

            <br><br>

            ✅ Medical Emergency

            <br>

            ✅ Women Safety Threat

            <br>

            ✅ Road Accident

            <br>

            ✅ Crime / Assault

            <br>

            ✅ Fire Emergency

        <br><br>

            The system will immediately record your alert and help responders identify the emergency type.
        .sos-btn{
    
</p>

        </div>

        <!-- Emergency Form -->

        <div class="glass card">

            <h2>Emergency Alert</h2>

            <br>

            <form action="send_alert.php" method="POST">

                <label><h3>Emergency Type</h3></label>

                <select name="emergency_type"
                    style="width:100%;padding:12px;border-radius:10px;">
                    <option>Medical Emergency</option>
                    <option>Women Safety</option>
                    <option>Road Accident</option>
                    <option>Crime / Assault</option>
                    <option>Fire Emergency</option>

                </select>
                
                <br><br>

                <button class="btn" type="submit">
                    Send Alert
                </button>

            </form>

        </div>

        <!-- Trusted Contacts -->

        <div class="glass card">

            <h2>Trusted Contacts</h2>
        <form action="add_contact.php" method="POST">

            <input type="text"
                name="contact_name"
                placeholder="Contact Name"
                required>

            <br><br>

            <input type="text"
                name="contact_phone"
                placeholder="Phone Number"
                required>

            <br><br>

            <input type="text"
                name="relationship"
                placeholder="Relationship"
                required>

            <br><br>

            <button class="btn" type="submit">
                Add Contact
            </button>

        </form>
        <?php

            $email = $_SESSION['email'];

            $sql = "SELECT * FROM trusted_contacts
            WHERE user_email='$email'";

            $result = $conn->query($sql);

            while($row = $result->fetch_assoc())
            {
            echo "<div style='margin-top:10px;'>";

            echo "<strong>" .
            $row['contact_name'] .
            "</strong><br>";

            echo $row['contact_phone'] .
            "<br>";

            echo $row['relationship'];

            echo "</div>";
            }

        ?>

        </div>

        <!-- Helplines -->

        <div class="glass card">

            <h2>Emergency Helplines</h2>

            <ul>
                <li>Police - 100</li>
                <li>Ambulance - 108</li>
                <li>Women Helpline - 1091</li>
                <li>Fire Brigade - 101</li>
            </ul>

        </div>

        <!-- Location -->

        <div class="glass card">

            <h2>Current Location</h2>

            <p>Location will appear here.</p>

            <button class="btn">
                Share Live Location
            </button>

        </div>

        <!-- History -->

        <div class="glass card">

            <h2>Recent Activity</h2>

            <ul>
                <?php

                $email = $_SESSION['email'];
    
                $getUser = "SELECT user_id
                FROM users
                WHERE email='$email'";

                $result = $conn->query($getUser);

                $user = $result->fetch_assoc();

                $user_id = $user['user_id'];

                $sql = "SELECT * FROM emergency_details
                WHERE user_id='$user_id'
                ORDER BY emergency_id DESC";

                $result = $conn->query($sql);

                while($row = $result->fetch_assoc())
                {
                    echo "<p>";

                    echo $row['emergency_type'];

                    echo " - ";

                    echo $row['created_at'];

                    echo "</p>";
                }

                ?>
            </ul>

        </div>

    </div>

    <a href="logout.php" class="btn logout-btn">
    Logout
    </a>

</div>

</body>
</html>
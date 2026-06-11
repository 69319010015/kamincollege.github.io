<?php
/**
 * Database connection file
 * Returns a MySQLi connection object or dies on error
 */

$host = 'localhost';
$username = 'root'; // Change as needed
$password = ''; // Change as needed
$dbname = 'registration_db'; // Change as needed

// Create connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to utf8mb4 for full Unicode support (including Thai)
$conn->set_charset("utf8mb4");

// Return the connection object
return $conn;
?>
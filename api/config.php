<?php
// ensure no stray whitespace before this tag – always start PHP at top of file
// disable error display so warnings/notices don't corrupt JSON output
ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);
// buffer any output so we can clear it before sending JSON responses
ob_start();

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'labbird_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// Create connection
function getDBConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit;
    }
}

// Helper function to send JSON response
function sendResponse($data, $statusCode = 200) {
    // clear any buffered output (warnings, whitespace, etc.)
    if (ob_get_length() !== false) {
        ob_clean();
    }

    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Helper function to get POST data
function getPostData() {
    return json_decode(file_get_contents('php://input'), true);
}

// Helper function to validate required fields
function validateRequired($data, $fields) {
    foreach ($fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            return false;
        }
    }
    return true;
}
?>
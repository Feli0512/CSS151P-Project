<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['name']) || !isset($data['student_id']) || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

$name = trim($data['name']);
$student_id = trim($data['student_id']);
$email = trim($data['email']);
$password = $data['password'];

if (empty($name) || empty($student_id) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'All fields cannot be empty']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

if (strlen($password) < 8) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters']);
    exit;
}

try {
    // Check if email or student_id already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? OR student_id = ?");
    $stmt->execute([$email, $student_id]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email or Student ID already exists']);
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("INSERT INTO users (name, student_id, email, password) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $student_id, $email, $hashed_password]);
    
    echo json_encode(['success' => true, 'message' => 'Account created successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
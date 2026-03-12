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

if (!$data || !isset($data['equipment_id']) || !isset($data['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Equipment ID and User ID are required']);
    exit;
}

$equipment_id = trim($data['equipment_id']);  // string ID like 'CHEM-001'
$user_id = (int)$data['user_id'];           // numeric user ID
$quantity = isset($data['quantity']) ? (int)$data['quantity'] : 1;
$purpose = isset($data['purpose']) ? trim($data['purpose']) : 'Laboratory work';
$date_needed = isset($data['date_needed']) ? trim($data['date_needed']) : date('Y-m-d');
$expected_return = isset($data['expected_return']) ? trim($data['expected_return']) : null;

if (empty($equipment_id) || $user_id <= 0 || $quantity <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid IDs or quantity']);
    exit;
}

try {
    // Check if equipment exists and is available
    $stmt = $pdo->prepare("SELECT id, name, status, quantity_available FROM equipment WHERE id = ?");
    $stmt->execute([$equipment_id]);
    $equipment = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$equipment) {
        echo json_encode(['success' => false, 'message' => 'Equipment not found']);
        exit;
    }
    
    if ($equipment['status'] !== 'Available' || $equipment['quantity_available'] < $quantity) {
        echo json_encode(['success' => false, 'message' => 'Insufficient quantity available']);
        exit;
    }
    
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    if (!$stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }
    
    // Start transaction
    $pdo->beginTransaction();
    
    // Insert transaction with all details
    $stmt = $pdo->prepare("INSERT INTO transactions (user_id, equipment_id, type, status, purpose, date_needed, expected_return, date) VALUES (?, ?, 'Borrow', 'Pending', ?, ?, ?, NOW())");
    $stmt->execute([$user_id, $equipment_id, $purpose, $date_needed, $expected_return]);
    
    // Update equipment quantity
    $stmt = $pdo->prepare("UPDATE equipment SET quantity_available = quantity_available - ? WHERE id = ?");
    $stmt->execute([$quantity, $equipment_id]);
    
    // If quantity_available is now 0, set status to Borrowed
    if ($equipment['quantity_available'] - $quantity == 0) {
        $stmt = $pdo->prepare("UPDATE equipment SET status = 'Borrowed' WHERE id = ?");
        $stmt->execute([$equipment_id]);
    }
    
    $pdo->commit();
    
    echo json_encode(['success' => true, 'message' => 'Borrow request submitted successfully']);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
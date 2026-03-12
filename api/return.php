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

$equipment_id = (int)$data['equipment_id'];
$user_id = (int)$data['user_id'];

if ($equipment_id <= 0 || $user_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid IDs']);
    exit;
}

try {
    // Check if there's an active borrow transaction for this user and equipment
    $stmt = $pdo->prepare("SELECT id FROM transactions WHERE user_id = ? AND equipment_id = ? AND type = 'Borrow' AND status IN ('Pending', 'Approved') ORDER BY date DESC LIMIT 1");
    $stmt->execute([$user_id, $equipment_id]);
    $transaction = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$transaction) {
        echo json_encode(['success' => false, 'message' => 'No active borrow found for this equipment']);
        exit;
    }
    
    // Start transaction
    $pdo->beginTransaction();
    
    // Mark the original borrow transaction as Completed
    $stmt = $pdo->prepare("UPDATE transactions SET status = 'Completed' WHERE id = ?");
    $stmt->execute([$transaction['id']]);
    
    // Insert return transaction
    $stmt = $pdo->prepare("INSERT INTO transactions (user_id, equipment_id, type, status, date) VALUES (?, ?, 'Return', 'Completed', NOW())");
    $stmt->execute([$user_id, $equipment_id]);
    
    // Update equipment quantity
    $stmt = $pdo->prepare("UPDATE equipment SET quantity_available = quantity_available + 1 WHERE id = ?");
    $stmt->execute([$equipment_id]);
    
    // Set status back to Available if it was Borrowed
    $stmt = $pdo->prepare("UPDATE equipment SET status = 'Available' WHERE id = ? AND quantity_available > 0");
    $stmt->execute([$equipment_id]);
    
    $pdo->commit();
    
    echo json_encode(['success' => true, 'message' => 'Equipment returned successfully']);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
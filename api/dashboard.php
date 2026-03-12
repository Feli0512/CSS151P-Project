<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;

if ($user_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit;
}

try {
    // Currently borrowed (Approved Borrow transactions)
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count FROM transactions 
        WHERE user_id = ? AND type = 'Borrow' AND status = 'Approved'
    ");
    $stmt->execute([$user_id]);
    $currently_borrowed = $stmt->fetch()['count'];
    
    // Pending requests (Pending transactions)
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count FROM transactions 
        WHERE user_id = ? AND status = 'Pending'
    ");
    $stmt->execute([$user_id]);
    $pending_requests = $stmt->fetch()['count'];
    
    // Returned this month
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count FROM transactions 
        WHERE user_id = ? AND type = 'Return' AND status = 'Completed' 
        AND DATE_FORMAT(date, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
    ");
    $stmt->execute([$user_id]);
    $returned_this_month = $stmt->fetch()['count'];
    
    // Available equipment count
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM equipment WHERE quantity_available > 0");
    $available_equipment = $stmt->fetch()['count'];
    
    // Recent transactions (last 10)
    $stmt = $pdo->prepare("
        SELECT t.id, t.type, t.status, t.date, e.name as equipment_name, e.department, t.quantity
        FROM transactions t
        JOIN equipment e ON t.equipment_id = e.id
        WHERE t.user_id = ?
        ORDER BY t.date DESC
        LIMIT 10
    ");
    $stmt->execute([$user_id]);
    $recent_transactions_raw = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Normalize recent transactions
    $recent_transactions = array_map(function($item) {
        return [
            'id' => $item['id'],
            'type' => $item['type'],
            'status' => $item['status'],
            'date' => $item['date'],
            'equipmentName' => $item['equipment_name'],
            'department' => $item['department'],
            'quantity' => $item['quantity']
        ];
    }, $recent_transactions_raw);
    
    // Upcoming returns (Approved borrows ordered by expected_return)
    $stmt = $pdo->prepare("
        SELECT t.id, t.type, t.status, t.date, t.expected_return, e.name as equipment_name, e.department, t.quantity
        FROM transactions t
        JOIN equipment e ON t.equipment_id = e.id
        WHERE t.user_id = ? AND t.type = 'Borrow' AND t.status = 'Approved'
        ORDER BY t.expected_return ASC
        LIMIT 10
    ");
    $stmt->execute([$user_id]);
    $upcoming_returns_raw = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Normalize upcoming returns
    $upcoming_returns = array_map(function($item) {
        return [
            'id' => $item['id'],
            'type' => $item['type'],
            'status' => $item['status'],
            'date' => $item['date'],
            'expectedReturn' => $item['expected_return'],
            'equipmentName' => $item['equipment_name'],
            'department' => $item['department'],
            'quantity' => $item['quantity']
        ];
    }, $upcoming_returns_raw);
    
    echo json_encode([
        'success' => true,
        'stats' => [
            'currently_borrowed' => (int)$currently_borrowed,
            'pending_requests' => (int)$pending_requests,
            'returned_this_month' => (int)$returned_this_month,
            'available_equipment' => (int)$available_equipment
        ],
        'recent_transactions' => $recent_transactions,
        'upcoming_returns' => $upcoming_returns
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>

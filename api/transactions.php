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
$type = isset($_GET['type']) ? trim($_GET['type']) : null;
$status = isset($_GET['status']) ? trim($_GET['status']) : null;

if ($user_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit;
}

try {
    $query = "
        SELECT t.id, t.type, t.date, t.status, e.name as equipment_name, e.id as equipment_id, e.department
        FROM transactions t
        JOIN equipment e ON t.equipment_id = e.id
        WHERE t.user_id = ?
    ";
    $params = [$user_id];
    
    if ($type) {
        $query .= " AND t.type = ?";
        $params[] = $type;
    }
    
    if ($status) {
        $query .= " AND t.status = ?";
        $params[] = $status;
    }
    
    $query .= " ORDER BY t.date DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $transactions]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
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

$department = isset($_GET['department']) ? trim($_GET['department']) : '';
$status = isset($_GET['status']) ? trim($_GET['status']) : null;

if (empty($department)) {
    echo json_encode(['success' => false, 'message' => 'Department is required']);
    exit;
}

$valid_departments = ['Chemistry', 'Physics', 'SOIT'];
if (!in_array($department, $valid_departments)) {
    echo json_encode(['success' => false, 'message' => 'Invalid department']);
    exit;
}

try {
    $query = "SELECT id, name, department, status, quantity_available, total_quantity FROM equipment WHERE department = ?";
    $params = [$department];
    
    // Filter by status if provided
    if ($status) {
        $query .= " AND status = ?";
        $params[] = $status;
    }
    
    $query .= " ORDER BY name ASC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $equipment = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Normalize field names to camelCase for frontend consistency
    $normalized = array_map(function($item) {
        return [
            'id' => $item['id'],
            'name' => $item['name'],
            'department' => $item['department'],
            'status' => $item['status'],
            'quantityAvailable' => (int)($item['quantity_available'] ?? 0),
            'totalQuantity' => (int)($item['total_quantity'] ?? 0)
        ];
    }, $equipment);
    
    echo json_encode(['success' => true, 'data' => $normalized]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
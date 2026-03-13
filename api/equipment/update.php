<?php
require_once __DIR__ . '/../config.php';

$data = getPostData();

$requiredFields = ['id', 'name', 'department', 'status', 'quantity_available', 'total_quantity'];
$missing = [];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
        $missing[] = $field;
    }
}

if (!empty($missing)) {
    sendResponse([
        'success' => false,
        'message' => 'All fields are required',
        'missing' => $missing
    ], 400);
}

$id = $data['id'];
$name = $data['name'];
$department = $data['department'];
$status = $data['status'];
$quantity_available = (int)$data['quantity_available'];
$total_quantity = (int)$data['total_quantity'];
$image_url = isset($data['image_url']) ? $data['image_url'] : null;

try {
    $pdo = getDBConnection();

    $stmt = $pdo->prepare("UPDATE equipment SET name = ?, department = ?, status = ?, quantity_available = ?, total_quantity = ?, image_url = ? WHERE id = ?");
    $stmt->execute([$name, $department, $status, $quantity_available, $total_quantity, $image_url, $id]);

    sendResponse(['success' => true, 'message' => 'Equipment updated successfully']);
} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to update equipment'], 500);
}
?>
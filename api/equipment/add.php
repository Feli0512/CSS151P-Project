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

    $stmt = $pdo->prepare("INSERT INTO equipment (id, name, department, status, quantity_available, total_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$id, $name, $department, $status, $quantity_available, $total_quantity, $image_url]);

    sendResponse(['success' => true, 'message' => 'Equipment added successfully']);
} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to add equipment'], 500);
}
?>
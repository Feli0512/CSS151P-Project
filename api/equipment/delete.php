<?php
require_once __DIR__ . '/../config.php';

$data = getPostData();

if (!isset($data['id']) || $data['id'] === '' || $data['id'] === null) {
    sendResponse(['success' => false, 'message' => 'Equipment ID is required'], 400);
}

$id = $data['id'];

try {
    $pdo = getDBConnection();

    $stmt = $pdo->prepare("DELETE FROM equipment WHERE id = ?");
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        sendResponse(['success' => false, 'message' => 'Equipment not found'], 404);
    }

    sendResponse(['success' => true, 'message' => 'Equipment deleted successfully']);
} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to delete equipment'], 500);
}
?>
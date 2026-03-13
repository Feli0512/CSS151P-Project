<?php
require_once __DIR__ . '/../config.php';

try {
    $pdo = getDBConnection();

    $stmt = $pdo->query("SELECT id, name, department, status, quantity_available, total_quantity, image_url FROM equipment ORDER BY name");
    $equipment = $stmt->fetchAll();

    sendResponse(['success' => true, 'equipment' => $equipment]);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to fetch equipment'], 500);
}
?>
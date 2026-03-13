<?php
require_once __DIR__ . '/../config.php';

try {
    $pdo = getDBConnection();

    $stmt = $pdo->query("SELECT id, name, email, employee_id, status, requested_at FROM admin_users ORDER BY requested_at DESC");
    $adminUsers = $stmt->fetchAll();

    sendResponse(['success' => true, 'adminUsers' => $adminUsers]);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to fetch admin users'], 500);
}
?>
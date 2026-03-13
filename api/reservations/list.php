<?php
require_once __DIR__ . '/../config.php';

try {
    $pdo = getDBConnection();

    $stmt = $pdo->query("SELECT * FROM reservations ORDER BY submitted_at DESC");
    $reservations = $stmt->fetchAll();

    sendResponse(['success' => true, 'reservations' => $reservations]);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to fetch reservations'], 500);
}
?>
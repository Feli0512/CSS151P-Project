<?php
require_once __DIR__ . '/../config.php';

$data = getPostData();

if (!validateRequired($data, ['reservationId'])) {
    sendResponse(['success' => false, 'message' => 'Reservation ID is required'], 400);
}

$reservationId = $data['reservationId'];

try {
    $pdo = getDBConnection();

    // Delete reservation
    $stmt = $pdo->prepare("DELETE FROM reservations WHERE id = ?");
    $stmt->execute([$reservationId]);

    if ($stmt->rowCount() === 0) {
        sendResponse(['success' => false, 'message' => 'Reservation not found'], 404);
    }

    sendResponse(['success' => true, 'message' => 'Reservation deleted successfully']);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to delete reservation'], 500);
}
?>
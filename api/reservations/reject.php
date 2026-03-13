<?php
require_once __DIR__ . '/../config.php';

$data = getPostData();

if (!validateRequired($data, ['reservationId'])) {
    sendResponse(['success' => false, 'message' => 'Reservation ID is required'], 400);
}

$reservationId = $data['reservationId'];

try {
    $pdo = getDBConnection();

    // Update reservation status
    $stmt = $pdo->prepare("UPDATE reservations SET status = 'Rejected' WHERE id = ? AND status = 'Pending'");
    $stmt->execute([$reservationId]);

    if ($stmt->rowCount() === 0) {
        sendResponse(['success' => false, 'message' => 'Reservation not found or not pending'], 404);
    }

    sendResponse(['success' => true, 'message' => 'Reservation rejected successfully']);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to reject reservation'], 500);
}
?>
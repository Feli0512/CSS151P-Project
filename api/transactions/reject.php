<?php
require_once '../config.php';

$data = getPostData();

if (!validateRequired($data, ['transactionId'])) {
    sendResponse(['success' => false, 'message' => 'Transaction ID is required'], 400);
}

$transactionId = $data['transactionId'];

try {
    $pdo = getDBConnection();

    // Update transaction status
    $stmt = $pdo->prepare("UPDATE transactions SET status = 'Rejected' WHERE id = ? AND status = 'Pending'");
    $stmt->execute([$transactionId]);

    if ($stmt->rowCount() === 0) {
        sendResponse(['success' => false, 'message' => 'Transaction not found or not pending'], 404);
    }

    sendResponse(['success' => true, 'message' => 'Transaction rejected successfully']);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to reject transaction'], 500);
}
?>
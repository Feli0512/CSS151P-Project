<?php
require_once '../config.php';

$data = getPostData();

if (!validateRequired($data, ['transactionId'])) {
    sendResponse(['success' => false, 'message' => 'Transaction ID is required'], 400);
}

$transactionId = $data['transactionId'];

try {
    $pdo = getDBConnection();

    // Get transaction details
    $stmt = $pdo->prepare("SELECT equipment_id, quantity, status FROM transactions WHERE id = ? AND type = 'Borrow'");
    $stmt->execute([$transactionId]);
    $transaction = $stmt->fetch();

    if (!$transaction) {
        sendResponse(['success' => false, 'message' => 'Transaction not found'], 404);
    }

    if ($transaction['status'] !== 'Approved') {
        sendResponse(['success' => false, 'message' => 'Can only return approved transactions'], 400);
    }

    // Update transaction status
    $stmt = $pdo->prepare("UPDATE transactions SET status = 'Completed', returned_at = NOW() WHERE id = ?");
    $stmt->execute([$transactionId]);

    // Update equipment quantity
    $stmt = $pdo->prepare("UPDATE equipment SET quantity_available = quantity_available + ? WHERE id = ?");
    $stmt->execute([$transaction['quantity'], $transaction['equipment_id']]);

    sendResponse(['success' => true, 'message' => 'Equipment returned successfully']);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to process return'], 500);
}
?>
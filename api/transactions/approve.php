<?php
require_once __DIR__ . '/../config.php';

$data = getPostData();

if (!validateRequired($data, ['transactionId'])) {
    sendResponse(['success' => false, 'message' => 'Transaction ID is required'], 400);
}

$transactionId = $data['transactionId'];

try {
    $pdo = getDBConnection();

    // Get transaction details
    $stmt = $pdo->prepare("SELECT equipment_id, quantity FROM transactions WHERE id = ? AND status = 'Pending'");
    $stmt->execute([$transactionId]);
    $transaction = $stmt->fetch();

    if (!$transaction) {
        sendResponse(['success' => false, 'message' => 'Transaction not found or not pending'], 404);
    }

    // Check equipment availability
    $stmt = $pdo->prepare("SELECT quantity_available FROM equipment WHERE id = ?");
    $stmt->execute([$transaction['equipment_id']]);
    $equipment = $stmt->fetch();

    if ($equipment['quantity_available'] < $transaction['quantity']) {
        sendResponse(['success' => false, 'message' => 'Insufficient quantity available'], 400);
    }

    // Update transaction status
    $stmt = $pdo->prepare("UPDATE transactions SET status = 'Approved', approved_at = NOW() WHERE id = ?");
    $stmt->execute([$transactionId]);

    // Update equipment quantity
    $stmt = $pdo->prepare("UPDATE equipment SET quantity_available = quantity_available - ? WHERE id = ?");
    $stmt->execute([$transaction['quantity'], $transaction['equipment_id']]);

    sendResponse(['success' => true, 'message' => 'Transaction approved successfully']);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to approve transaction'], 500);
}
?>
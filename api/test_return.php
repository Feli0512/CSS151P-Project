<?php
require_once 'db.php';

$user_id = 1;
$equipment_id = 1; // Beaker 100ml

echo "Before return:\n";
$stmt = $pdo->prepare("SELECT id, status FROM transactions WHERE user_id = ? AND equipment_id = ? AND type = 'Borrow' ORDER BY date DESC LIMIT 1");
$stmt->execute([$user_id, $equipment_id]);
$borrow = $stmt->fetch();
echo "Borrow transaction status: " . $borrow['status'] . "\n";

$stmt = $pdo->query("SELECT quantity_available FROM equipment WHERE id = 1");
$eq = $stmt->fetch();
echo "Beaker quantity available: " . $eq['quantity_available'] . "\n";

// Simulate the return
echo "\nSimulating return...\n";
try {
    $pdo->beginTransaction();
    
    // Mark the original borrow transaction as Completed
    $stmt = $pdo->prepare("UPDATE transactions SET status = 'Completed' WHERE id = ?");
    $stmt->execute([$borrow['id']]);
    
    // Insert return transaction
    $stmt = $pdo->prepare("INSERT INTO transactions (user_id, equipment_id, type, status, date) VALUES (?, ?, 'Return', 'Completed', NOW())");
    $stmt->execute([$user_id, $equipment_id]);
    
    // Update equipment quantity
    $stmt = $pdo->prepare("UPDATE equipment SET quantity_available = quantity_available + 1 WHERE id = ?");
    $stmt->execute([$equipment_id]);
    
    // Set status back to Available if it was Borrowed
    $stmt = $pdo->prepare("UPDATE equipment SET status = 'Available' WHERE id = ? AND quantity_available > 0");
    $stmt->execute([$equipment_id]);
    
    $pdo->commit();
    
    echo "Return successful!\n";
} catch (Exception $e) {
    $pdo->rollBack();
    echo "Error: " . $e->getMessage();
}

echo "\nAfter return:\n";
$stmt = $pdo->prepare("SELECT id, status FROM transactions WHERE user_id = ? AND equipment_id = ? AND type = 'Borrow' ORDER BY date DESC LIMIT 1");
$stmt->execute([$user_id, $equipment_id]);
$borrow = $stmt->fetch();
echo "Borrow transaction status: " . $borrow['status'] . "\n";

$stmt = $pdo->query("SELECT quantity_available FROM equipment WHERE id = 1");
$eq = $stmt->fetch();
echo "Beaker quantity available: " . $eq['quantity_available'] . "\n";

echo "\nApproved borrows for user $user_id:\n";
$stmt = $pdo->prepare("
    SELECT t.id, t.type, t.status, e.name, t.quantity
    FROM transactions t
    JOIN equipment e ON t.equipment_id = e.id
    WHERE t.user_id = ? AND t.type = 'Borrow' AND t.status = 'Approved'
");
$stmt->execute([$user_id]);
$approved = $stmt->fetchAll();
echo "Count: " . count($approved) . "\n";
echo json_encode($approved, JSON_PRETTY_PRINT);
?>

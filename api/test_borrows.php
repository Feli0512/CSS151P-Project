<?php
require_once 'db.php';

$user_id = 1; // Test with user 1

// Fetch approved borrow transactions
$stmt = $pdo->prepare("
    SELECT t.id, t.type, t.date, t.status, e.name as equipment_name, e.id as equipment_id, e.department
    FROM transactions t
    JOIN equipment e ON t.equipment_id = e.id
    WHERE t.user_id = ? AND t.type = 'Borrow' AND t.status = 'Approved'
    ORDER BY t.date DESC
");
$stmt->execute([$user_id]);
$transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Approved borrows for user $user_id:\n";
echo json_encode($transactions, JSON_PRETTY_PRINT);
?>

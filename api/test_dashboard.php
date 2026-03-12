<?php
require_once 'db.php';

$user_id = 1; // Test with user 1

// Direct database call
echo "Direct database test:\n";

$stmt = $pdo->prepare("
    SELECT COUNT(*) as count FROM transactions 
    WHERE user_id = ? AND type = 'Borrow' AND status = 'Approved'
");
$stmt->execute([$user_id]);
$currently_borrowed = $stmt->fetch()['count'];
echo "Currently borrowed: $currently_borrowed\n";

$stmt = $pdo->prepare("
    SELECT t.id, t.type, t.status, t.date, t.expected_return, e.name as equipment_name, e.department, t.quantity
    FROM transactions t
    JOIN equipment e ON t.equipment_id = e.id
    WHERE t.user_id = ? AND t.type = 'Borrow' AND t.status = 'Approved'
    ORDER BY t.expected_return ASC
");
$stmt->execute([$user_id]);
$upcoming_returns = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "\nUpcoming returns:\n";
echo json_encode($upcoming_returns, JSON_PRETTY_PRINT);
?>

<?php
require_once 'db.php';

// Check total equipment
$stmt = $pdo->query('SELECT COUNT(*) as count FROM equipment');
$result = $stmt->fetch();
echo "Total equipment in database: " . $result['count'] . "\n\n";

// Check Chemistry equipment
$stmt = $pdo->query('SELECT id, name, department, quantity_available FROM equipment WHERE department = "Chemistry" ORDER BY id');
$chemistry = $stmt->fetchAll();
echo "Chemistry equipment (" . count($chemistry) . " items):\n";
foreach ($chemistry as $item) {
    echo "  ID: " . $item['id'] . ", Name: " . $item['name'] . ", Qty: " . $item['quantity_available'] . "\n";
}

// Check for duplicates
echo "\n\nDuplicate check (grouped by name):\n";
$stmt = $pdo->query('SELECT name, COUNT(*) as count FROM equipment GROUP BY name');
while ($row = $stmt->fetch()) {
    echo "  " . $row['name'] . ": " . $row['count'] . " copies\n";
}
?>

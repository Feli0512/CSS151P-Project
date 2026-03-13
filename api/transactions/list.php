<?php
require_once '../config.php';

$userType = $_GET['userType'] ?? null;
$studentId = $_GET['studentId'] ?? null;

try {
    $pdo = getDBConnection();

    $query = "SELECT * FROM transactions";
    $params = [];

    if ($userType === 'student' && $studentId) {
        $query .= " WHERE student_id = ?";
        $params[] = $studentId;
    }

    $query .= " ORDER BY date DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $transactions = $stmt->fetchAll();

    sendResponse(['success' => true, 'transactions' => $transactions]);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to fetch transactions'], 500);
}
?>
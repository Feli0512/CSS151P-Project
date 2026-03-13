<?php
require_once __DIR__ . '/../config.php';

$data = getPostData();

$requiredFields = ['equipmentId', 'studentId', 'quantity', 'date', 'expectedReturn', 'purpose'];
$missing = [];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
        $missing[] = $field;
    }
}

if (!empty($missing)) {
    sendResponse([
        'success' => false,
        'message' => 'All fields are required',
        'missing' => $missing
    ], 400);
}

$equipmentId = $data['equipmentId'];
$studentId = $data['studentId'];
$quantity = (int)$data['quantity'];
$date = $data['date'];
$expectedReturn = $data['expectedReturn'];
$purpose = $data['purpose'];

try {
    $pdo = getDBConnection();

    // Get equipment details
    $stmt = $pdo->prepare("SELECT name, department, quantity_available FROM equipment WHERE id = ?");
    $stmt->execute([$equipmentId]);
    $equipment = $stmt->fetch();

    if (!$equipment) {
        sendResponse(['success' => false, 'message' => 'Equipment not found'], 404);
    }

    if ($equipment['quantity_available'] < $quantity) {
        sendResponse(['success' => false, 'message' => 'Insufficient quantity available'], 400);
    }

    // Get student details
    $stmt = $pdo->prepare("SELECT name, email FROM students WHERE student_id = ?");
    $stmt->execute([$studentId]);
    $student = $stmt->fetch();

    if (!$student) {
        sendResponse(['success' => false, 'message' => 'Student not found'], 404);
    }

    // Generate transaction ID
    $transactionId = 'TXN-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

    // Insert transaction
    $stmt = $pdo->prepare("INSERT INTO transactions (id, equipment_id, equipment_name, department, date, type, status, user_name, student_id, quantity, expected_return, purpose) VALUES (?, ?, ?, ?, ?, 'Borrow', 'Pending', ?, ?, ?, ?, ?)");
    $stmt->execute([
        $transactionId,
        $equipmentId,
        $equipment['name'],
        $equipment['department'],
        $date,
        $student['name'],
        $studentId,
        $quantity,
        $expectedReturn,
        $purpose
    ]);

    sendResponse(['success' => true, 'message' => 'Borrow request submitted successfully', 'transactionId' => $transactionId]);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to submit borrow request'], 500);
}
?>
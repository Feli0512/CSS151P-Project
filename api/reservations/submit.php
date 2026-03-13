<?php
require_once __DIR__ . '/../config.php';

$data = getPostData();

if (!validateRequired($data, ['name', 'email', 'department', 'equipment', 'dateNeeded', 'timeNeeded', 'purpose'])) {
    sendResponse(['success' => false, 'message' => 'All fields are required'], 400);
}

$name = trim($data['name']);
$email = trim($data['email']);
$department = $data['department'];
$equipment = $data['equipment'];
$dateNeeded = $data['dateNeeded'];
$timeNeeded = $data['timeNeeded'];
$purpose = $data['purpose'];
$additionalNotes = $data['additionalNotes'] ?? '';

try {
    $pdo = getDBConnection();

    // Generate reservation ID
    $reservationId = 'RES-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

    // Insert reservation
    $stmt = $pdo->prepare("INSERT INTO reservations (id, name, email, department, equipment, date_needed, time_needed, purpose, additional_notes, status, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())");
    $stmt->execute([
        $reservationId,
        $name,
        $email,
        $department,
        $equipment,
        $dateNeeded,
        $timeNeeded,
        $purpose,
        $additionalNotes
    ]);

    sendResponse(['success' => true, 'message' => 'Reservation submitted successfully', 'reservationId' => $reservationId]);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to submit reservation'], 500);
}
?>
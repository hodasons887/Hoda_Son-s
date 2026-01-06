<?php
// Contact Form Handler for Hoda & Son's
// This file processes contact form submissions and sends emails

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request']);
    exit();
}

// Validate required fields
$errors = [];
$name = isset($input['name']) ? trim($input['name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$company = isset($input['company']) ? trim($input['company']) : '';
$phone = isset($input['phone']) ? trim($input['phone']) : '';
$service = isset($input['service']) ? trim($input['service']) : '';
$projectDetails = isset($input['projectDetails']) ? trim($input['projectDetails']) : '';

if (empty($name)) $errors[] = 'Name is required';
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required';
if (empty($service)) $errors[] = 'Service selection is required';
if (empty($projectDetails)) $errors[] = 'Project details are required';

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['errors' => $errors]);
    exit();
}

// Sanitize inputs
$name = htmlspecialchars($name, ENT_QUOTES);
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$company = htmlspecialchars($company, ENT_QUOTES);
$phone = htmlspecialchars($phone, ENT_QUOTES);
$service = htmlspecialchars($service, ENT_QUOTES);
$projectDetails = htmlspecialchars($projectDetails, ENT_QUOTES);

// Email configuration
$to = 'hodasons887@gmail.com';
$subject = "New Contact Form Submission from {$name}";

// Create email body
$emailBody = "
New Contact Form Submission

Name: {$name}
Email: {$email}
Company: {$company}
Phone: {$phone}
Service: {$service}
Timestamp: " . date('Y-m-d H:i:s') . "

Project Details:
{$projectDetails}

---
This is an automated message from your website contact form.
";

// Email headers
$headers = "From: {$email}\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$emailSent = mail($to, $subject, $emailBody, $headers);

if ($emailSent) {
    // Also send confirmation email to user
    $confirmationSubject = "We Received Your Message - Hoda & Son's";
    $confirmationBody = "
Hi {$name},

Thank you for reaching out to Hoda & Son's. We have received your message and will review it shortly.

We typically respond within one business day.

Best regards,
The Hoda & Son's Team

Contact Information:
Email: hodasons887@gmail.com
Phone: +91 9523420887
Website: https://hodasons.com
";
    $confirmationHeaders = "From: hodasons887@gmail.com\r\n";
    $confirmationHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    mail($email, $confirmationSubject, $confirmationBody, $confirmationHeaders);
    
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Your message has been sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send message. Please try again.']);
}
?>

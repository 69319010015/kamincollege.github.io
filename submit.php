<?php
/**
 * Form submission handler for registration form
 * Processes form data, inserts into database, and syncs to Google Sheets
 */

// Include database connection
require_once 'database.php';

// Include Google API Client (adjust path if needed)
require_once 'vendor/autoload.php';

/**
 * Function to append data to Google Sheets
 */
function appendToGoogleSheets($formData) {
    try {
        // Path to your service account key file
        $putenv('GOOGLE_APPLICATION_CREDENTIALS=' . __DIR__ . '/atomic-segment-499015-e8-953caebdb8eb.json');
        
        $client = new Google_Client();
        $client->useApplicationDefaultCredentials();
        $client->addScope(Google_Service_Sheets::SPREADSHEETS);
        
        // Initialize the Sheets service
        $service = new Google_Service_Sheets($client);
        
        // YOUR SPREADSHEET ID - Get this from your Google Sheet URL:
        // https://docs.google.com/spreadsheets/d/[YOUR_SPREADSHEET_ID]/edit
        $spreadsheetId = '1cauh0ZHmo1mFj5M8FlPsYS2nBRRDnF1gzQ3WUB4wkcw';
        
        // Prepare the row data
        $values = [
            [
                date('Y-m-d H:i:s'), // Timestamp
                $formData['title'] ?? '',
                $formData['firstname'] ?? '',
                $formData['lastname'] ?? '',
                $formData['dob'] ?? '',
                $formData['gender'] ?? '',
                $formData['organization'] ?? '',
                $formData['jobtitle'] ?? '',
                $formData['department'] ?? '',
                $formData['email'] ?? '',
                $formData['phone'] ?? '',
                $formData['address'] ?? '',
                $formData['province'] ?? '',
                $formData['postalcode'] ?? '',
                $formData['attendance'] ?? '',
                $formData['diet'] ?? '',
                $formData['allergies'] ?? '',
                $formData['tshirt'] ?? '',
                $formData['terms'] ?? 'no',
                $formData['pdpa'] ?? 'no',
                $formData['newsletter'] ?? 'no'
            ]
        ];
        
        $body = new Google_Service_Sheets_ValueRange([
            'values' => $values
        ]);
        
        // Append the data to the sheet
        $params = [
            'valueInputOption' => 'RAW'
        ];
        
        $result = $service->spreadsheets_values->append(
            $spreadsheetId,
            'Sheet1!A:U', // Adjust if your sheet name is different
            $body,
            $params
        );
        
        return true;
    } catch (Exception $e) {
        // Log error but don't fail the form submission
        error_log("Google Sheets Error: " . $e->getMessage());
        return false;
    }
}

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Initialize variables
    $title = $_POST['title'] ?? '';
    $firstname = $_POST['firstname'] ?? '';
    $lastname = $_POST['lastname'] ?? '';
    $dob = $_POST['dob'] ?? '';
    $gender = $_POST['gender'] ?? '';
    $organization = $_POST['organization'] ?? '';
    $jobtitle = $_POST['jobtitle'] ?? '';
    $department = $_POST['department'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $address = $_POST['address'] ?? '';
    $province = $_POST['province'] ?? '';
    $postalcode = $_POST['postalcode'] ?? '';
    $attendance = $_POST['attendance'] ?? '';
    $allergies = $_POST['allergies'] ?? '';
    $tshirt = $_POST['tshirt'] ?? '';
    $terms = isset($_POST['terms']) ? 'yes' : 'no';
    $pdpa = isset($_POST['pdpa']) ? 'yes' : 'no';
    $newsletter = isset($_POST['newsletter']) ? 'yes' : 'no';

    // Handle dietary requirements (checkboxes - multiple values)
    $diet = isset($_POST['diet']) ? implode(',', $_POST['diet']) : '';

    // Basic validation
    $errors = [];

    if (empty($firstname)) {
        $errors[] = "กรุณากรอกชื่อ";
    }

    if (empty($lastname)) {
        $errors[] = "กรุณากรอกนามสกุล";
    }

    if (empty($email)) {
        $errors[] = "กรุณากรอกอีเมล";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "กรุณากรอกอีเมลให้ถูกต้อง";
    }

    if (empty($phone)) {
        $errors[] = "กรุณากรอกเบอร์โทรศัพท์";
    }

    if (empty($address)) {
        $errors[] = "กรุณากรอกที่อยู่";
    }

    if (empty($province)) {
        $errors[] = "กรุณาเลือกจังหวัด";
    }

    if (empty($postalcode)) {
        $errors[] = "กรุณากรอกรหัสไปรษณีย์";
    }

    if (empty($attendance)) {
        $errors[] = "กรุณาเลือกประเภทการเข้าร่วม";
    }

    if ($attendance == 'ออนไซต์' && empty($diet)) {
        $errors[] = "กรุณาเลือกอย่างน้อยหนึ่งประเภทอาหารสำหรับการเข้าร่วมแบบออนไซต์";
    }

    if (empty($tshirt)) {
        $errors[] = "กรุณาเลือกขนาดเสื้อ";
    }

    if ($terms != 'yes') {
        $errors[] = "กรุณายอมรับข้อกำหนดและเงื่อนไข";
    }

    if ($pdpa != 'yes') {
        $errors[] = "กรุณายินยอมให้ใช้ข้อมูลส่วนบุคคล";
    }

    // If there are errors, redirect back to form with errors
    if (!empty($errors)) {
        // Store errors in session for display
        session_start();
        $_SESSION['form_errors'] = $errors;
        $_SESSION['form_data'] = $_POST;
        header("Location: index.html");
        exit;
    }

    // Prepare SQL statement
    $sql = "INSERT INTO registrations (title, firstname, lastname, dob, gender, organization, jobtitle, department, email, phone, address, province, postalcode, attendance, diet, allergies, tshirt_size, terms_accepted, pdpa_consent, newsletter_optin, registration_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Bind parameters
    $stmt->bind_param("ssssssssssssssssssss",
        $title, $firstname, $lastname, $dob, $gender, $organization, $jobtitle, $department,
        $email, $phone, $address, $province, $postalcode, $attendance, $diet, $allergies, $tshirt,
        $terms, $pdpa, $newsletter);

    // Execute query
    if ($stmt->execute()) {
        // Success - redirect to thank you page or show success message
        session_start();
        $_SESSION['registration_success'] = true;
        
        // Prepare data for Google Sheets
        $formData = [
            'title' => $title,
            'firstname' => $firstname,
            'lastname' => $lastname,
            'dob' => $dob,
            'gender' => $gender,
            'organization' => $organization,
            'jobtitle' => $jobtitle,
            'department' => $department,
            'email' => $email,
            'phone' => $phone,
            'address' => $address,
            'province' => $province,
            'postalcode' => $postalcode,
            'attendance' => $attendance,
            'diet' => $diet,
            'allergies' => $allergies,
            'tshirt' => $tshirt,
            'terms' => $terms,
            'pdpa' => $pdpa,
            'newsletter' => $newsletter
        ];
        
        // Attempt to sync to Google Sheets (non-critical - won't fail form submission)
        appendToGoogleSheets($formData);
        
        header("Location: thank-you.html");
        exit;
    } else {
        // Error
        die("Error inserting record: " . $stmt->error);
    }

    // Close statement
    $stmt->close();
} else {
    // Not a POST request - redirect to form
    header("Location: index.html");
    exit;
}

// Close connection
$conn->close();
?>
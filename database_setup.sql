-- Database setup for registration system
-- Run this SQL to create the necessary table structure

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS registration_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE registration_db;

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(10) NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    dob DATE NULL,
    gender ENUM('ชาย', 'หญิง', 'อื่นๆ', 'ไม่ระบุ') NULL,
    organization VARCHAR(100) NULL,
    jobtitle VARCHAR(100) NULL,
    department VARCHAR(100) NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    province VARCHAR(50) NOT NULL,
    postalcode VARCHAR(10) NOT NULL,
    attendance ENUM('ออนไลน์', 'ออนไซต์') NOT NULL,
    diet VARCHAR(100) NULL, -- Comma-separated values for multiple selections
    allergies VARCHAR(255) NULL,
    tshirt_size ENUM('S', 'M', 'L', 'XL', '2XL') NOT NULL,
    terms_accepted ENUM('yes', 'no') NOT NULL DEFAULT 'no',
    pdpa_consent ENUM('yes', 'no') NOT NULL DEFAULT 'no',
    newsletter_optin ENUM('yes', 'no') NOT NULL DEFAULT 'no',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_registration_date (registration_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert some sample data for testing (optional)
-- INSERT INTO registrations (firstname, lastname, email, phone, address, province, postalcode, attendance, diet, tshirt_size, terms_accepted, pdpa_consent) 
-- VALUES ('ทดสอบ', 'ทดสอบ', 'test@example.com', '0812345678', '123 ถนนทดสอบ', 'กรุงเทพมหานคร', '10100', 'ออนไลน์', 'ปกติ', 'M', 'yes', 'yes');

-- Show table structure
DESCRIBE registrations;
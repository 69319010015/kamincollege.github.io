# Google Sheets Integration Guide for Registration Form

This guide explains how to connect your PHP registration form to Google Sheets for real-time data synchronization while maintaining the existing MySQL database storage.

## Overview
- Form data will be stored in both MySQL database (existing) and Google Sheets (new)
- Uses Google Sheets API with Service Account authentication
- Real-time updates to Google Sheets upon successful form submission

## Prerequisites

1. **Google Account** - You need a Google account to access Google Cloud Console
2. **Web Server with PHP** - Your form needs to run on a server with PHP 5.6+ 
3. **Internet Access** - Server must be able to connect to Google APIs

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your Project ID (you'll need it later)

## Step 2: Enable Google Sheets API

1. In Cloud Console, navigate to **APIs & Services > Library**
2. Search for "Google Sheets API"
3. Click on it and press **Enable**

## Step 3: Create Service Account

1. Go to **APIs & Services > Credentials**
2. Click **+ CREATE CREDENTIALS > Service account**
3. Fill in service account details:
   - Name: `registration-form-sheets`
   - Description: `Service account for registration form to access Google Sheets`
4. Click **CREATE AND CONTINUE**
5. Grant role: **Project > Editor** (or more restrictive: **Service Account User**)
6. Click **CONTINUE** then **DONE**

## Step 4: Generate Service Account Key

1. In Credentials page, find your service account under "Service accounts"
2. Click on the service account email
3. Go to **Keys** tab
4. Click **ADD KEY > Create new key**
5. Choose **JSON** key type
6. Click **Create** - JSON file will download automatically
7. Rename the file to `sheets-service-account.json`
8. Move this file to your project directory: `D:\AI code\Vscode\sheets-service-account.json`

### What the JSON Key File Contains:
The service account key file should look like this (example structure):
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project-id.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

**Do NOT confuse this with just an ID or hash** - you need the complete JSON file.

## Step 5: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new blank spreadsheet
3. Name it something like "Registration Form Responses"
4. Set up column headers in Row 1 matching your form fields:
   ```
   Timestamp, Title, First Name, Last Name, Date of Birth, Gender, Organization, 
   Job Title, Department, Email, Phone, Address, Province, Postal Code, 
   Attendance Type, Dietary Requirements, Allergies, T-Shirt Size, 
   Terms Accepted, PDPA Consent, Newsletter Opt-in
   ```
5. Share the spreadsheet with your service account email:
   - Click **Share** button in top right
   - Paste the service account email (ends in @your-project-id.iam.gserviceaccount.com)
   - Set permission to **Editor**
   - Click **Send**

## Step 6: Install Google API Client (Manual Method)

Since Composer isn't available in this environment, you'll need to manually download the Google API Client Library:

1. Download the Google API Client Library for PHP from:
   https://github.com/googleapis/google-api-php-client/releases
   
2. Extract the ZIP file and copy the `src/` folder to your project:
   ```
   D:\AI code\Vscode\vendor\google\apiclient\
   ```

3. Your directory structure should look like:
   ```
   D:\AI code\Vscode\
   ├─ vendor\
   │  └─ google\
   │     └─ apiclient\
   │        └─ src\
   │           ├─ Google\
   │           └─ autoload.php
   ├─ sheets-service-account.json
   └─ (your existing files)
   ```

## Step 7: Update submit.php

Your submit.php has already been updated to include:
1. Google API Client integration
2. Function to append data to Google Sheets
3. Your specific Google Sheet ID: `1cauh0ZHmo1mFj5M8FlPsYS2nBRRDnF1gzQ3WUB4wkcw`
4. Service account authentication using `sheets-service-account.json`

## Important Configuration Steps

### 1. Verify Your Service Account Email
You mentioned your service account email is: `kamin-836@atomic-segment-499015-e8.iam.gserviceaccount.com`
Make sure this matches the `client_email` field in your JSON key file.

### 2. Verify Sheet Name
- The code assumes your first sheet is named "Sheet1"
- If you renamed it, you'll need to update `'Sheet1!A:U'` in submit.php to match your sheet name

### 3. File Permissions
- Ensure your web server can read the `sheets-service-account.json` file
- Recommended permissions: 644 (readable by owner and group)

## Troubleshooting

### Common Issues:
1. **Authentication Errors**
   - Double-check service account email has Editor access to the Google Sheet
   - Verify JSON key file path is correct and contains the full JSON (not just an ID)
   - Ensure system clock is synchronized (JWT tokens are time-sensitive)

2. **API Not Enabled**
   - Confirm Google Sheets API is enabled in Cloud Console
   - Wait a few minutes after enabling API before testing

3. **Quota Exceeded**
   - Google Sheets API has generous limits but monitor usage
   - Consider implementing exponential backoff for production use

4. **PHP Extensions Missing**
   - Required: openssl, json, curl
   - Check with `php -m` or phpinfo()

## Security Considerations

1. **Service Account Key Protection**
   - Never commit `sheets-service-account.json` to version control
   - Add it to your `.gitignore` file
   - Consider using environment variables for production deployments

2. **Principle of Least Privilege**
   - Instead of Project Editor role, consider:
     - Creating a custom role with only `spreadsheets` permissions
     - Or using the predefined `roles/iam.serviceAccountTokenCreator` if appropriate

## Testing

1. Submit a test registration through your form
2. Check MySQL database for the new record
3. Verify the data appears in your Google Sheet within a few seconds
4. Check PHP error logs if data doesn't appear in Sheets

## Maintenance

1. Monitor Google Cloud Console for API usage and errors
2. Periodically regenerate service account keys for security
3. Keep Google API Client library updated
4. Backup your Google Sheet regularly

## Notes

- The Google Sheets integration is designed to be non-critical - if Sheets API fails, the form submission still succeeds and stores data in MySQL
- Real-time means near-instantaneous (typically under 5 seconds) but not guaranteed
- Consider adding a webhook or notification system if you need immediate alerts for new submissions

## Your Specific Information:
- **Service Account Email**: `kamin-836@atomic-segment-499015-e8.iam.gserviceaccount.com`
- **Google Sheet ID**: `1cauh0ZHmo1mFj5M8FlPsYS2nBRRDnF1gzQ3WUB4wkcw` (already configured in submit.php)
- **JSON Key File**: Should be placed as `D:\AI code\Vscode\sheets-service-account.json`

Once you've completed all these steps, your form should successfully submit data to both your MySQL database and Google Sheet in real-time!